import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import { bookingController } from "./booking.controller";
import roleMiddleware from "../../middlewares/role.middleware";


const router = Router();

router.post("/",authMiddleware, bookingController.createBooking);
router.get("/", authMiddleware, bookingController.getAllBookings);

export const bookingRoutes = router;
