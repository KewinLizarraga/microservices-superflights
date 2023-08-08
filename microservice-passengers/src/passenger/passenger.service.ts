import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPassenger } from 'src/common/interfaces/passenger.intereface';
import { PASSENGER } from 'src/common/model/models';
import { PassengerDTO } from './dto/passenger.dto';

@Injectable()
export class PassengerService {
  constructor(
    @InjectModel(PASSENGER.name) private readonly model: Model<IPassenger>,
  ) {}

  async create(passengetDto: PassengerDTO): Promise<IPassenger> {
    const newPassenger = new this.model(passengetDto);
    return newPassenger.save();
  }

  async getAll(): Promise<IPassenger[]> {
    return this.model.find();
  }

  async getOne(id: string): Promise<IPassenger> {
    const passenger = await this.model.findById(id);
    if (!passenger) throw new NotFoundException('Passenger not found');
    return passenger;
  }

  async update(id: string, passengerDto: PassengerDTO): Promise<IPassenger> {
    await this.getOne(id);
    return await this.model.findByIdAndUpdate(id, passengerDto, { new: true });
  }

  async remove(id: string): Promise<any> {
    await this.getOne(id);
    await this.model.findByIdAndDelete(id);
  }
}
