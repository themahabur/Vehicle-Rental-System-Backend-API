import { pool } from "../../config/database";

export const createVehicle = async (payload: any) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status
  } = payload;

  if (!vehicle_name || !type || !registration_number || !daily_rent_price) {
    throw new Error("All fields are required");
  }

  const result = await pool.query(
    `INSERT INTO vehicles 
     (vehicle_name, type, registration_number, daily_rent_price, availability_status)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status || "available"
    ]
  );

  return result.rows[0];
};

export const getAllVehicles = async () => {
  const result = await pool.query("SELECT * FROM vehicles");
  return result.rows;
};

export const getVehicleById = async (id: string) => {
  const result = await pool.query(
    "SELECT * FROM vehicles WHERE id = $1",
    [id]
  );

  if (result.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  return result.rows[0];
};

export const updateVehicle = async (id: string, payload: any) => {
  const result = await pool.query(
    `UPDATE vehicles
     SET vehicle_name = COALESCE($1, vehicle_name),
         daily_rent_price = COALESCE($2, daily_rent_price),
         availability_status = COALESCE($3, availability_status)
     WHERE id = $4
     RETURNING *`,
    [
      payload.vehicle_name,
      payload.daily_rent_price,
      payload.availability_status,
      id
    ]
  );

  if (result.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  return result.rows[0];
};

export const deleteVehicle = async (id: string) => {
  const activeBooking = await pool.query(
    `SELECT id FROM bookings 
     WHERE vehicle_id = $1 AND status = 'active'`,
    [id]
  );

  if (activeBooking.rows.length > 0) {
    throw new Error("Vehicle has active bookings");
  }

  await pool.query("DELETE FROM vehicles WHERE id = $1", [id]);
};
