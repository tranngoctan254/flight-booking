import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "../utils/jwt";

interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

export const authorize = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user information" });
    }

    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient permissions" });
    }

    next();
  };
};
