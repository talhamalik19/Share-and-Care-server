import { Router } from 'express';
import {
  signin,
  signup,
  signout,
  deleteAccount,
  resumeSession,
  updateAccount,
  updatePassword,
  fetchStats,
} from '../controllers/user.js';

const userRouter = Router();

userRouter.post('/signup', signup);
userRouter.post('/signin', signin);
userRouter.put('/update-account', updateAccount);
userRouter.put('/update-password', updatePassword);
userRouter.post('/delete-account', deleteAccount);
userRouter.post('/signout', signout);
userRouter.post('/resume-session', resumeSession);
userRouter.post('/fetchStats', fetchStats);

export default userRouter;
