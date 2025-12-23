import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

router.get("/", (req, res) => {
  res.send("Get all users");
});

router.post("/", userController.createUser);

router.get("/:id", (req, res) => {
  res.send(`Get user with ID ${req.params.id}`);
});
router.put("/:id", (req, res) => {
  res.send(`Update user with ID ${req.params.id}`);
});
router.delete("/:id", (req, res) => {
  res.send(`Delete user with ID ${req.params.id}`);
}); 


export const userRoutes = router;