import { IDevice, IUser } from "@src/types/user";
import { Schema, model } from "mongoose";
const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'Users';

const devicesSchema = new Schema<IDevice>({
  id: { type: String, require: true },
  name: { type: String},
  ip: { type: String },
  location: { type: String },
  refreshToken: { type: String, required: true }
}, { timestamps: true, collection: COLLECTION_NAME });

const userSchema = new Schema<IUser>({
  username: { type: String, require: true, index: true, unique: true},
  password: { type: String, require: true },
  fullname: { type: String },
  devices: { type: [devicesSchema] }
}, { timestamps: true, collection: COLLECTION_NAME });

const UserModel = model(DOCUMENT_NAME, userSchema);
export default UserModel;