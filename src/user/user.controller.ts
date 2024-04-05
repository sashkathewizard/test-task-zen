import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request, Req
} from "@nestjs/common";
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccessGuard } from '../auth/gurds/access.guard';

@UseGuards(AccessGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Get('')
  // findAll() {
  //   return this.userService.findAll();               // for admin route
  // }

  @Get('profile') // or '/' route
  findOne(@Request() req) {
    return this.userService.findOne(req.user.id);
  }

  @Patch()
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.id, updateUserDto);
  }

  @Delete('')
  remove(@Request() req) {
    return this.userService.remove(req.user.id);
  }
}
