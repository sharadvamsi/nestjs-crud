// user.model.ts

import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String },
});

export interface User extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  profileImage?: string;
}
