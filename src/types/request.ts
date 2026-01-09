import { Request } from "express";
import { IAuthToken } from "./auth";

export interface AuthRequest extends Request {
    user?: IAuthToken
}
