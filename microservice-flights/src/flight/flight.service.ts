import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import moment from 'moment';
import { Model } from 'mongoose';

import { IFlight } from '../common/interfaces/flight.interface';
import { ILocation } from '../common/interfaces/location.interface';
import { IWeather } from '../common/interfaces/weather.interface';
import { FLIGHT } from '../common/models/models';
import { FlightDTO } from './dto/flight.dto';

@Injectable()
export class FlightService {
  constructor(
    @InjectModel(FLIGHT.name) private readonly model: Model<IFlight>,
  ) {}

  async getLocation(destinationCity: string): Promise<ILocation> {
    const { data } = await axios.get(
      `https://www.metaweather.com/api/location/search/?query=${destinationCity}`,
    );
    return data[0];
  }

  async getWeather(woeid: number, flightDate: Date): Promise<IWeather[]> {
    const dateFormat = moment.utc(flightDate).format();

    const year = dateFormat.substring(0, 4);
    const month = dateFormat.substring(5, 7);
    const day = dateFormat.substring(8, 10);

    const { data } = await axios.get(
      `https://www.metaweather.com/api/location/${woeid}/${year}/${month}/${day}`,
    );

    return data;
  }

  assign(
    { _id, pilot, airplane, destinationCity, flightDate, passengers }: IFlight,
    weather: IWeather[],
  ): IFlight {
    return Object.assign({
      _id,
      pilot,
      airplane,
      destinationCity,
      flightDate,
      passengers,
      weather,
    });
  }

  async create(flightDto: FlightDTO): Promise<IFlight> {
    const newFlight = new this.model(flightDto);
    return await newFlight.save();
  }

  async getAll(): Promise<IFlight[]> {
    return this.model.find().populate('passengers');
  }

  async getOne(id: string): Promise<IFlight> {
    const flight = await (await this.model.findById(id)).populate('passengers');
    const location: ILocation = await this.getLocation(flight.destinationCity);

    const weather: IWeather[] = await this.getWeather(
      location.woeid,
      flight.flightDate,
    );
    return this.assign(flight, weather);
  }

  async update(id: string, flightDto: FlightDTO): Promise<IFlight> {
    return await this.model.findByIdAndUpdate(id, flightDto, { new: true });
  }

  async delete(id: string) {
    await this.model.findByIdAndDelete(id);
    return { status: HttpStatus.OK, msg: 'Deleted' };
  }

  async addPassenger(flightId: string, passengerId: string): Promise<IFlight> {
    return await this.model
      .findByIdAndUpdate(
        flightId,
        {
          $addToSet: { passengers: passengerId },
        },
        { new: true },
      )
      .populate('passengers');
  }
}
