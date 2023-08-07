import mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true },
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: { type: String, unique: true },
  },
  {
    timestamps: true,
  },
);

UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });
