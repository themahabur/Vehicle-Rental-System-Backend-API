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
        json_build_object(
          'name', u.name,
          'email', u.email
        ) AS customer,
        json_build_object(
          'vehicle_name', v.vehicle_name,
          'registration_number', v.registration_number
        ) AS vehicle
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      JOIN vehicles v ON b.vehicle_id = v.id
      ORDER BY b.id DESC
      `
    );

    return result.rows;
  }

  const result = await pool.query(
    `
    SELECT
      b.id,
      b.vehicle_id,
      b.rent_start_date,
      b.rent_end_date,
      b.total_price,
      b.status,
      json_build_object(
        'vehicle_name', v.vehicle_name,
        'registration_number', v.registration_number,
        'type', v.type
      ) AS vehicle
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.customer_id = $1
    ORDER BY b.id DESC
    `,
    [authUser.id]
  );

  return result.rows;
};


const updateBooking = async (
  authUser: any,
  bookingId: string,
  status: "cancelled" | "returned"
) => {
  if (!status) {
    throw new Error("Status is required");
  }

  // 1️⃣ get booking
  const bookingRes = await pool.query(
    "SELECT * FROM bookings WHERE id = $1",
    [bookingId]
  );

  if (bookingRes.rows.length === 0) {
    throw new Error("Booking not found");
  }

  const booking = bookingRes.rows[0];

  // 2️⃣ CUSTOMER → cancel
  if (status === "cancelled") {
    if (authUser.role !== "customer") {
      throw new Error("Only customer can cancel booking");
    }

    if (booking.customer_id !== authUser.id) {
      const error: any = new Error("Forbidden");
      error.status = 403;
      throw error;
    }

    if (new Date() >= new Date(booking.rent_start_date)) {
      throw new Error("Cannot cancel after booking start date");
    }

    const result = await pool.query(
      `UPDATE bookings
       SET status = 'cancelled'
       WHERE id = $1
       RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status`,
      [bookingId]
    );

    return {
      message: "Booking cancelled successfully",
      data: result.rows[0]
    };
  }

  // 3️⃣ ADMIN → returned
  if (status === "returned") {
    if (authUser.role !== "admin") {
      const error: any = new Error("Forbidden");
      error.status = 403;
      throw error;
    }

    const result = await pool.query(
      `UPDATE bookings
       SET status = 'returned'
       WHERE id = $1
       RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status`,
      [bookingId]
    );

    // update vehicle availability
    await pool.query(
      `UPDATE vehicles
       SET availability_status = 'available'
       WHERE id = $1`,
      [booking.vehicle_id]
    );

    return {
      message: "Booking marked as returned. Vehicle is now available",
      data: {
        ...result.rows[0],
        vehicle: {
          availability_status: "available"
        }
      }
    };
  }

  throw new Error("Invalid status update");
};


export const bookingService = {
  createBooking,
  getAllBookings,
  updateBooking
};
