import { JwtPayload } from "jsonwebtoken";
import { User } from "../interfaces";
import { DecodedToken } from "../../interfaces";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | User;
      file: Buffer;
    }
  }
}
