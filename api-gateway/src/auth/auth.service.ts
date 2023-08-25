import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserMSG } from '../common/constants';
import { ClientProxySuperFlights } from '../common/proxy/client-proxy';
import { UserDTO } from '../user/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly clientProxy: ClientProxySuperFlights,
    private readonly jwtService: JwtService,
  ) {}

  private _clientProxyUser = this.clientProxy.clientProxyUsers();

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this._clientProxyUser.send(UserMSG.VALID_USER, {
      username,
      password,
    });

    if (user) return user;

    return null;
  }

  async signIn(user: any) {
    const payload = { username: user.username, sub: user._id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async signUp(userDto: UserDTO) {
    return this._clientProxyUser.send(UserMSG.CREATE, userDto);
  }
}
