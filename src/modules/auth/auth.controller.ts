import { Request, Response } from "express";
import { authService } from "./auth.service";

const signup = async(req: Request, res: Response) => {
    
    try {
        const result = await authService.signup(req.body);
    
        delete result.rows[0].password;
    
        res.status(201).json({
          success: true,
          message: "User registered successfully",
          data: result.rows[0],
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "User created failed",
        });
      }
};

const signin = async(req: Request, res: Response) => {
   try {
        const result = await authService.signin(req.body);
    
        res.status(201).json({
          success: true,
          message: "User signin successfully",
          data: result
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "User signin failed",
        });
      }
};


export const authController = { signup, signin };