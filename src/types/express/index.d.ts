import { JwtPayload } from "jsonwebtoken";
import { User } from "../interfaces";
import { DecodedToken } from "../../contracts";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | User;
      file: Buffer;
    }
  }
}
