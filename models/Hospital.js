import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    token: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

hospitalSchema.methods.hashPassword = async function (password) {
  const hospital = this;
  const hashedPassword = await bcrypt.hash(password, 10);
  hospital.password = hashedPassword;
  await hospital.save();
};

hospitalSchema.methods.validatePassword = async function (password) {
  const hospital = this;
  const compare = await bcrypt.compare(password, hospital.password);
  return compare;
};

hospitalSchema.methods.generateAuthToken = async function () {
  const hospital = this;
  const token = await jwt.sign({ _id: hospital._id }, process.env.SECRET_TOKEN);
  hospital.token = token;
  await hospital.save();
};

hospitalSchema.methods.validateToken = async function (token) {
  const hospital = this;
  try {
    const decoded = await jwt.verify(token, process.env.SECRET_TOKEN);
    if (decoded._id === hospital._id.toString()) {
      return true;
    }
    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
};

hospitalSchema.methods.removeToken = async function () {
  const hospital = this;
  hospital.token = null;
  await hospital.save();
};

hospitalSchema.methods.updateAccount = async function (
  name,
  phone,
  website,
  address
) {
  const hospital = this;
  hospital.name = name;
  hospital.website = website;
  hospital.phone = phone;
  hospital.address = address;
  await hospital.save();
};

export default mongoose.model('hospitals', hospitalSchema);
