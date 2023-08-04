import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { ClientProxySuperFlights } from '../common/proxy/client-proxy';
import { UserDTO } from './dto/user.dto';
import { IUser } from '../common/interfaces/user.interface';
import { UserMSG } from '../common/constants';

@Controller('api/v2/user')
export class UserController {
  constructor(private readonly clientProxy: ClientProxySuperFlights) {}
  private _clientProxyUser = this.clientProxy.clientProxyUsers();

  @Post()
  create(@Body() userDto: UserDTO): Observable<IUser> {
    return this._clientProxyUser.send(UserMSG.CREATE, userDto);
  }

  @Get()
  findAll(): Observable<IUser[]> {
    return this._clientProxyUser.send(UserMSG.FIND_ALL, '');
  }

  @Get(':id')
  findOne(@Param('id') id: string): Observable<IUser> {
    return this._clientProxyUser.send(UserMSG.FIND_ONE, id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() userDto: UserDTO): Observable<IUser> {
    return this._clientProxyUser.send(UserMSG.UPDATE, { id, userDto });
  }

  @Delete(':id')
  remove(@Param('id') id: string): Observable<any> {
    return this._clientProxyUser.send(UserMSG.DELETE, { id });
  }
}
