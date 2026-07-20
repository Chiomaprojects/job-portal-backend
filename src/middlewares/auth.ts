import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secret.js";
import { UnauthorizedException } from "../exceptions/unauthorized.js";    
import type { Request, Response, NextFunction } from "express";
import { ErrorCode } from "../exceptions/root.js";
import { prismaClient } from "../index.js";



const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;   

  if (!token) {
    return next(new UnauthorizedException("Unauthorized.", ErrorCode.UNAUTHORIZED));
  } 

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const user = await prismaClient.user.findFirst({
      where: { id: payload.userId },
    });
    if (!user) {
      return next(new UnauthorizedException("Unauthorized.", ErrorCode.UNAUTHORIZED));
    } 
    req.user = user;  
    next();
  } catch (error) {
    next(new UnauthorizedException("Unauthorized.", ErrorCode.UNAUTHORIZED));
  }   
};

export default authMiddleware;

