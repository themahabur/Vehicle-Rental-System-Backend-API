import { pool } from "../../config/database";
import bcrypt from "bcryptjs";

const createUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;

  try {
    const hashedPassword = await bcrypt.hash(password as string, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [name, email, hashedPassword, phone, role]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

export const userService = {
  createUser,
};
