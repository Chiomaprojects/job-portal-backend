import type { NextFunction, Request, Response } from "express";
import { hash, compare } from "bcrypt";
import { prismaClient } from "../index.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secret.js";
import { BadRequestException } from "../exceptions/bad-request.js";
import { ErrorCode } from "../exceptions/root.js";
import { SignupSchema } from "../schema/users.js";
import { UnprocessablEntity } from "../exceptions/validation.js";

export const signup = async (req: Request, res: Response, next: NextFunction) => {

SignupSchema.parse(req.body); // Validate request body using SignupSchema 
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
  } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({
      message: "Invalid email or password.",
    });
  }

  const existingUser = await prismaClient.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new BadRequestException("User already exists.", ErrorCode.USER_ALREADY_EXISTS);
  }

  const hashedPassword = await hash(password, 10);

  const user = await prismaClient.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
    },
  });

  const { password: _, ...safeUser } = user;

  return res.status(201).json(safeUser);   
};



export const login = async (req: Request, res: Response) => {
  const {
    email,
    password,
  } = req.body;

  const user = await prismaClient.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(404).json({
      message: "Invalid email or password.",
    });
  }

  const isPasswordValid = await compare(
    password,
    user.password
);

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid email or password.",
    });
  }

  const { password: _, ...safeUser } = user;
  const token = jwt.sign
  ({ userId: user.id }, JWT_SECRET!,
     {expiresIn: "7d"}
  );


  return res.status(200).json({ ...safeUser, token });
};

  