import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() userDto: UserDTO) {
    return this.userService.create(userDto);
  }

  @Get()
  findAll() {
    return this.userService.getAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.getOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() userDto: UserDTO) {
    return this.userService.update(id, userDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
