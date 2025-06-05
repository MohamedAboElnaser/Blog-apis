import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(private authGuard: AuthGuard) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      return await this.authGuard.canActivate(context);
    } catch {
      // If authentication fails, allow the request to proceed
      // but without user information
      return true;
    }
  }
}
