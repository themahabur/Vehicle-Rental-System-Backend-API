import { pool } from "../../config/database";
import bcrypt from "bcryptjs";



const getAllUsers = async () => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, phone, role FROM users"
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

const updateUser = async (
  user: any,
  userId: string,
  payload: Record<string, unknown>
) => {
  if (user.role !== "admin" && user.id !== Number(userId)) {
    const error: any = new Error("Forbidden");
    error.status = 403;
    throw error;
  }
  if (user.role !== "admin") {
    delete payload.role;
  }

  if (payload.email) {
    payload.email = payload.email.toString().toLowerCase();
  }

  try {
    const result = await pool.query(
      `UPDATE users
         SET name = COALESCE($1, name),
         email = COALESCE($2, email),
         phone = COALESCE($3, phone),
         role = COALESCE($4, role)
         WHERE id = $5
         RETURNING id, name, email, phone, role`,
      [payload.name, payload.email, payload.phone, payload.role, userId]
    );

    if (result.rows.length === 0) {
      throw new Error("User not found");
    }

    return result.rows[0];
  } catch (error) {
    console.log(error+"--ddddd");
    throw error;
    
  }
};

const deleteUser = async (user: any, userId: string) => {
  if (user.role !== "admin" && user.id !== Number(userId)) {
    const error: any = new Error("Forbidden");
    error.status = 403;
    throw error;
  } else {
    try {
      const result = await pool.query(
        "DELETE FROM users WHERE id = $1 RETURNING id",
        [userId]
      );
      if (result.rows.length === 0) {
        throw new Error("User not found");
      }
    } catch (error) {
      throw error;
    }
  }
};

export const userService = {
  getAllUsers,
  updateUser,
  deleteUser
};
