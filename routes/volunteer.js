import express from 'express';
import {
  updateApplicantStatus,
  updateRequest,
  postRequest,
  fetchMyRequests,
  deleteRequest,
  updateRequestStatus,
  fetchRequests,
  withdrawApplication,
  hideRequest,
  applyForRequest,
} from '../controllers/volunteer.js';

const volunteerRouter = express.Router();

volunteerRouter.post('/postRequest', postRequest);
volunteerRouter.post('/fetchMyRequests', fetchMyRequests);
volunteerRouter.post('/updateRequest', updateRequest);
volunteerRouter.post('/deleteRequest', deleteRequest);
volunteerRouter.post('/updateApplicantStatus', updateApplicantStatus);
volunteerRouter.post('/updateRequestStatus', updateRequestStatus);
//app
volunteerRouter.get('/fetchRequests', fetchRequests);
volunteerRouter.post('/applyForRequest', applyForRequest);
volunteerRouter.post('/withdrawApplication', withdrawApplication);
volunteerRouter.post('/hideRequest', hideRequest);

export default volunteerRouter;
