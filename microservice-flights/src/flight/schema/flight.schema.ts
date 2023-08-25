import * as mongoose from 'mongoose';

export const FlightSchema = new mongoose.Schema(
  {
    pilot: { type: String, required: true },
    airple: { type: String, required: true },
    destinationCity: { type: String, required: true },
    flightDate: { type: Date, required: true },
    passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'passengers' }],
  },
  {
    timestamps: true,
  },
);
