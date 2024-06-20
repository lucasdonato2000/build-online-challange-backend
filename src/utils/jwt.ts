import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../contracts";
import dotenv from "dotenv";
import { MissingEnvError, UnauthorizedError } from "../errors";

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new MissingEnvError("No JWT secret, please update .env");
}

const secret = process.env.JWT_SECRET;

const generateToken = (user: User): string => {
  try {
    return jwt.sign({ id: user.id, email: user.email }, secret, {
      expiresIn: "1h",
    });
  } catch (error) {
    throw new Error("Error generating jwt");
  }
};

const verifyToken = (token: string): string | JwtPayload => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new UnauthorizedError("Invalid Credentials");
  }
};

export { generateToken, verifyToken };
