import { pool } from "../../config/database";

const createBooking = async (authUser: any, payload: any) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  if (authUser.role !== "admin" && authUser.id !== customer_id) {
    const error: any = new Error("Forbidden");
    error.status = 403;
    throw error;
  }

  if (!rent_start_date || !rent_end_date) {
    throw new Error("Start and end dates are required");
  }

  if (new Date(rent_end_date) <= new Date(rent_start_date)) {
    throw new Error("End date must be after start date");
  }

  const vehicleResult = await pool.query(
    `SELECT id, vehicle_name, daily_rent_price, availability_status
     FROM vehicles WHERE id = $1`,
    [vehicle_id]
  );

  if (vehicleResult.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  const vehicle = vehicleResult.rows[0];

  if (vehicle.availability_status !== "available") {
    throw new Error("Vehicle is not available");
  }

  const start = new Date(rent_start_date);
  const end = new Date(rent_end_date);
  const days = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  const totalPrice = days * vehicle.daily_rent_price;

  const bookingResult = await pool.query(
    `INSERT INTO bookings
     (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
     VALUES ($1,$2,$3,$4,$5,'active')
     RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice]
  );

  await pool.query(
    `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
    [vehicle_id]
  );

  return {
    ...bookingResult.rows[0],
    vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: vehicle.daily_rent_price,
    },
  };
};

const getAllBookings = async (authUser: any) => {

  if (authUser.role === "admin") {
    const result = await pool.query(`
      SELECT 
        b.id,
        b.customer_id,
        b.vehicle_id,
        b.rent_start_date,
        b.rent_end_date,
        b.total_price,
        b.status,

        u.name AS customer_name,
        u.email AS customer_email,

        v.vehicle_name,
        v.registration_number
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      JOIN vehicles v ON b.vehicle_id = v.id
      ORDER BY b.id DESC
    `);

    const data = result.rows.map((row) => ({
      id: row.id,
      customer_id: row.customer_id,
      vehicle_id: row.vehicle_id,
      rent_start_date: row.rent_start_date,
      rent_end_date: row.rent_end_date,
      total_price: row.total_price,
      status: row.status,
      customer: {
        name: row.customer_name,
        email: row.customer_email,
      },
      vehicle: {
        vehicle_name: row.vehicle_name,
        registration_number: row.registration_number,
      },
    }));

    return data
  }


  const result = await pool.query(
    `
    SELECT 
      b.id,
      b.customer_id,
      b.vehicle_id,
      b.rent_start_date,
      b.rent_end_date,
      b.total_price,
      b.status,

      v.vehicle_name,
      v.registration_number,
      v.type
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.customer_id = $1
    ORDER BY b.id DESC
    `,
    [authUser.id]
  );

  const data = result.rows.map((row) => ({
    id: row.id,
    customer_id: row.customer_id,
    vehicle_id: row.vehicle_id,
    rent_start_date: row.rent_start_date,
    rent_end_date: row.rent_end_date,
    total_price: row.total_price,
    status: row.status,
    vehicle: {
      vehicle_name: row.vehicle_name,
      registration_number: row.registration_number,
      type: row.type,
    },
  }));

  return data
};


const updateBooking = async (
  bookingId: string,
  status: string,
  authUser: any
) => {

  const bookingResult = await pool.query(
    `SELECT * FROM bookings WHERE id = $1`,
    [bookingId]
  );

  if (bookingResult.rowCount === 0) {
    throw new Error("Booking not found");
  }

  const booking = bookingResult.rows[0];

  if (authUser.role === "customer") {
  
    if (status !== "cancelled") {
      throw new Error("Customers can only cancel bookings");
    }

 
    if (booking.customer_id !== authUser.id) {
      throw new Error("Unauthorized booking access");
    }


    const today = new Date();
    const rentStartDate = new Date(booking.rent_start_date);

    if (today >= rentStartDate) {
      throw new Error("Booking cannot be cancelled after start date");
    }

   
    const updatedBooking = await pool.query(
      `
      UPDATE bookings
      SET status = 'cancelled'
      WHERE id = $1
      RETURNING *
      `,
      [bookingId]
    );

    return {
      success: true,
      message: "Booking cancelled successfully",
      data: updatedBooking.rows[0],
    };
  }


  if (authUser.role === "admin") {
    if (status !== "returned") {
      throw new Error("Admin can only mark booking as returned");
    }

  
    const updatedBooking = await pool.query(
      `
      UPDATE bookings
      SET status = 'returned'
      WHERE id = $1
      RETURNING *
      `,
      [bookingId]
    );


    await pool.query(
      `
      UPDATE vehicles
      SET availability_status = 'available'
      WHERE id = $1
      `,
      [booking.vehicle_id]
    );

    return {
      success: true,
      message: "Booking marked as returned. Vehicle is now available",
      data: {
        ...updatedBooking.rows[0],
        vehicle: {
          availability_status: "available",
        },
      },
    };
  }

  throw new Error("Invalid role");
};


export const bookingService = {
  createBooking,
  getAllBookings,
  updateBooking,
};
