import {
  Controller,
  Delete,
  Get,
  NotImplementedException,
  UseGuards,
  Request,
  Patch,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RequestWithUser } from 'src/auth/types/request.type';
import { UpdateUserDto } from './update.user.dto';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('/me')
  get() {
    throw new NotImplementedException();
  }

  @Delete('/me')
  @UseGuards(AuthGuard)
  async remove(@Request() req: RequestWithUser) {
    await this.userService.delete(req.user.sub);

    return { message: 'User Deleted successfully' };
  }
  @Patch('/me')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseGuards(AuthGuard)
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: RequestWithUser,
  ) {
    console.log(`UpdateUserDto data : ${updateUserDto}`);
    return await this.userService.update(req.user.sub, updateUserDto);
  }
}
