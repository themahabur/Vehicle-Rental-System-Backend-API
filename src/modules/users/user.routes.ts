import { Router } from "express";
import { userController } from "./user.controller";
import authMiddleware from "../../middlewares/auth.middleware";
import roleMiddleware from "../../middlewares/role.middleware";

const router = Router();

router.get("/", userController.getAllUsers);

router.put("/:id", authMiddleware, roleMiddleware("admin"), userController.updateUser);

router.delete("/:id", authMiddleware, roleMiddleware("admin"), userController.deleteUser); 


export const userRoutes = router;