import {
  appId,
  appToken,
  baseUrl,
  baseUrlIndie,
  baseUrlGroup,
} from '../constants.js';
import axios from 'axios';

export const sendNotificationToUser = async (
  userId,
  title,
  message,
  pushData
) => {
  try {
    await axios
      .post(baseUrlIndie, {
        subID: userId,
        appId,
        appToken,
        title,
        message,
        pushData,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
};

export const sendNotificationToAll = async (title, body, pushData) => {
  try {
    await axios
      .post(baseUrl, {
        appId,
        appToken,
        title,
        body,
        pushData,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
};

export const sendNotificationToGroup = async (emails, title, body) => {
  try {
    await axios
      .post(baseUrlGroup, {
        subIDs: emails,
        appId: appId,
        appToken: appToken,
        title: title,
        message: body,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
};
