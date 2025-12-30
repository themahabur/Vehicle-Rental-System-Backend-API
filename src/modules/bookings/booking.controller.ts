import { Response } from "express";
import { bookingService } from "./booking.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

const createBooking = async (req: AuthRequest, res: Response) => {
  const user = req.user;
  try {
    const booking = await bookingService.createBooking(user, req.body);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error: any) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await bookingService.getAllBookings(req.user);

    const userRole = req.user?.role;
    console.log(req.user);

    res.status(200).json({
      success: true,
      message:
        userRole === "admin"
          ? "Bookings retrieved successfully"
          : "Your bookings retrieved successfully",
      data: bookings,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateBooking = async (req: AuthRequest, res: Response) => {
  try {
    const result = await bookingService.updateBooking(
      req.user,
      req.params.bookingId as string,
      req.body.status
    );

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error: any) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

export const bookingController = {
  createBooking,
  getAllBookings,
  updateBooking,
};
