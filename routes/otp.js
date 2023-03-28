import { Router } from 'express';
import {
  forgotPassword,
  resetPassword,
  verifyOtp,
} from '../controllers/otp.js';

const otpRouter = Router();

otpRouter.post('/forgotPassword', forgotPassword);
otpRouter.post('/verifyOtp', verifyOtp);
otpRouter.post('/resetPassword', resetPassword);

export default otpRouter;
