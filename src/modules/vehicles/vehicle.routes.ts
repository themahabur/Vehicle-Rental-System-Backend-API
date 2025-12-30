import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import roleMiddleware from "../../middlewares/role.middleware";
import { vehicleController } from "./vehicle.controller";

const router = Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  vehicleController.createVehicle
);

router.get("/", vehicleController.getAllVehicles);
router.get("/:vehicleId", vehicleController.getVehicleById);

router.put(
  "/:vehicleId",
  authMiddleware,
  roleMiddleware("admin"),
  vehicleController.updateVehicle
);

router.delete(
  "/:vehicleId",
  authMiddleware,
  roleMiddleware("admin"),
  vehicleController.deleteVehicle
);

export const vehicleRoutes = router;
