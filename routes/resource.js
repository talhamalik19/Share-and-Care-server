import { Router } from 'express';
import {
  postRequest,
  updateRequest,
  fetchRequests,
  approveRequest,
  deleteRequest,
  hideRequest,
} from '../controllers/resource.js';

const resourceRouter = Router();

resourceRouter.post('/postRequest', postRequest);
resourceRouter.post('/fetchRequests', fetchRequests);
resourceRouter.post('/updateRequest', updateRequest);
resourceRouter.put('/approveRequest', approveRequest);
resourceRouter.post('/deleteRequest', deleteRequest);
resourceRouter.put('/hideRequest', hideRequest);

export default resourceRouter;
