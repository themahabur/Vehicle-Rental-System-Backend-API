import express from "express";
import { userRoutes } from "./modules/users/user.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { vehicleRoutes } from "./modules/vehicles/vehicle.routes";
import { bookingRoutes } from "./modules/bookings/booking.routes";

const app = express();

app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/vehicles", vehicleRoutes);
app.use("/api/v1/bookings", bookingRoutes);

app.get("/api/v1/", (req, res) => {
  res.send("Hello, in the API v1!");
});

export default app;
