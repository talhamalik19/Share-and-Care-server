import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

const userSchema = new mongoose.Schema(
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
    cnic: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      default: '',
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

userSchema.methods.hashPassword = async function (password) {
  const user = this;
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  await user.save();
};

userSchema.methods.validatePassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.SECRET_TOKEN);
  user.token = token;
  await user.save();
};

userSchema.methods.validateToken = async function (token) {
  const user = this;
  try {
    const decoded = await jwt.verify(token, process.env.SECRET_TOKEN);
    if (decoded._id === user._id.toString()) {
      return true;
    }
    return false;
  } catch (err) {
    console.log(err.message);
    return false;
  }
};

userSchema.methods.removeToken = async function () {
  const user = this;
  user.token = null;
  await user.save();
};

userSchema.methods.updateAccount = async function (name, phone, address) {
  const user = this;
  user.name = name;
  user.phone = phone;
  user.address = address;
  await user.save();
};

export default mongoose.model('users', userSchema);
