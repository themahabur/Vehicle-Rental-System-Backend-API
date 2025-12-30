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

export const bookingService = {
  createBooking,
  getAllBookings,
};
