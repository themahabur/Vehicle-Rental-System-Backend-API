import { Request, Response } from "express";
import { userService } from "./user.service";



const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();

    res.json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = req.params.id as string;
    const payload = req.body;

    const result = await userService.updateUser(user, userId, payload);

    res.json({
      success: true,
      message: "User updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "User update failed",
    });
  }
};


const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = req.params.id as string; 

    await userService.deleteUser(user, userId); 

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error: any) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "User delete failed",
    });
  }
};

export const userController = {
  
  getAllUsers,
  updateUser,
  deleteUser
};
