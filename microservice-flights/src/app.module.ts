import { Module } from '@nestjs/common';
import { FlightModule } from './flight/flight.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development'],
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.URI_MONGODB),
    FlightModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
