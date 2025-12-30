import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

const roleMiddleware = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user as any;

    if (!user || !user.role) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};

export default roleMiddleware;
