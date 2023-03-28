import { Router } from 'express';
import { fetchDonations } from '../controllers/donation.js';

const donationRouter = Router();

donationRouter.get('/fetchDonations', fetchDonations);

export default donationRouter;
