import { Request } from 'express';

export interface UserPayload {
  sub: number;
  email: string;
  iat: number;
  exp: number;
}

export interface RequestWithUser extends Request {
  user: UserPayload;
}
