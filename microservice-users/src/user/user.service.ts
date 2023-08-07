import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { IUser } from '../common/interfaces/user.interface';
import { USER } from '../common/models/models';
import { UserDTO } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(USER.name) private readonly model: Model<IUser>) {}

  async checkPassword(password: string, passwordDB: string): Promise<boolean> {
    return await bcrypt.compare(password, passwordDB);
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async findByUsername(username: string): Promise<IUser> {
    return await this.model.findOne({ username });
  }

  async create(userDto: UserDTO): Promise<IUser> {
    const hash = await this.hashPassword(userDto.password);
    const newUser = new this.model({ ...userDto, password: hash });
    return await newUser.save();
  }

  async getAll(): Promise<IUser[]> {
    return await this.model.find();
  }

  async getOne(id: string): Promise<IUser> {
    const user = await this.model.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, userDto: UserDTO): Promise<IUser> {
    await this.getOne(id);
    const hash = await this.hashPassword(userDto.password);
    const user = { ...userDto, password: hash };
    return await this.model.findByIdAndUpdate(id, user, { new: true });
  }

  async remove(id: string): Promise<any> {
    await this.getOne(id);
    await this.model.deleteOne({ _id: id });
  }
}
