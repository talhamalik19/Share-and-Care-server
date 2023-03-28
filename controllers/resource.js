import Resource from '../models/Resource.js';
import { sendNotificationToUser } from '../utils/appNotifications.js';
import { sendResourceApprovedEmail } from '../utils/email.js';

export const postRequest = async (req, res) => {
  const {
    userType,
    resourceName,
    resourceQuantity,
    resourceDuration,
    requestedByName,
    requestedByEmail,
    requestedByPhone,
    requestedByAddress,
    resourceNotes,
  } = req.body;

  const newResource = new Resource({
    userType,
    resourceName,
    resourceQuantity,
    resourceDuration,
    resourceNotes,
    requestedByName,
    requestedByEmail,
    requestedByPhone,
    requestedByAddress,
  });

  await newResource
    .save()
    .then((result) => {
      res.send({
        status: '201',
        message: 'Request Posted',
      });
    })
    .catch((err) => {
      console.log(err);
      res.send({
        status: '500',
        message: 'Request Failed to Post',
        error: err,
      });
    });
};

export const updateRequest = async (req, res) => {
  const {
    id,
    resourceName,
    resourceQuantity,
    resourceDuration,
    resourceNotes,
  } = req.body;

  console.log(id);

  await Resource.findById(id)
    .then((resource) => {
      console.log(resource);
      if (resource.requestStatus !== 'Pending') {
        const { approvedByName } = resource;
        res.send({
          status: '409',
          message: 'Request already approved by ' + approvedByName,
        });
      } else {
        Resource.findByIdAndUpdate(id, {
          resourceName,
          resourceQuantity,
          resourceDuration,
          resourceNotes,
        })
          .then((result) => {
            res.send({
              status: '200',
              message: 'Resource Request Updated',
            });
          })
          .catch((err) => {
            console.log(err);
            res.send({
              status: '500',
              message: 'Failed to Update Resource Request',
              error: err,
            });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.send({
        status: '500',
        message: 'Resource Request Update Failed',
        error: err,
      });
    });
};

export const fetchRequests = async (req, res) => {
  const { userType } = req.body;
  if (userType === 'user') {
    await Resource.find({
      userType: 'user',
    })
      .then((result) => {
        res.send({
          status: '200',
          message: 'Requests Fetched',
          results: result,
        });
      })
      .catch((err) => {
        res.send({
          status: '500',
          message: 'Fetching Requests Failed',
          error: err,
        });
      });
  } else if (userType === 'hospital') {
    await Resource.find({})
      .then((result) => {
        res.send({
          status: '200',
          message: 'Requests Fetched Successfully',
          results: result,
        });
      })
      .catch((err) => {
        res.send({
          status: '500',
          message: 'Fetching Requests Failed',
          error: err,
        });
      });
  }
};

export const approveRequest = async (req, res) => {
  const {
    id,
    requestStatus,
    approvedByName,
    approvedByEmail,
    approvedByPhone,
  } = req.body;

  await Resource.findById(id)
    .then((resource) => {
      if (resource.requestStatus !== 'Pending') {
        const { approvedByName } = resource;
        res.send({
          status: '500',
          message: 'Request already approved by ' + approvedByName,
        });
      } else {
        Resource.findByIdAndUpdate(id, {
          requestStatus,
          approvedByName,
          approvedByPhone,
          approvedByEmail,
        })
          .then(async (result) => {
            const { resourceName, requestedByEmail, userType } = result;
            res.send({
              status: '200',
              message: 'Request Approved',
            });
            if (userType === 'user') {
              await sendNotificationToUser(
                requestedByEmail,
                'Resource Request Approved',
                `Your request for ${resourceName} has been approved by ${approvedByName}`,
                '{"screen": "Resources"}'
              );
            }
            Resource.findById(id).then(async (resource) => {
              await sendResourceApprovedEmail(resource);
            });
          })
          .catch((err) => {
            res.send({
              status: '500',
              message: 'Failed to Approve Request',
              error: err,
            });
          });
      }
    })
    .catch((err) => {
      res.send({
        status: '500',
        message: 'Request Approve Failed',
        error: err,
      });
    });
};

export const deleteRequest = async (req, res) => {
  const { id, email } = req.body;
  await Resource.findOne({
    _id: id,
    requestedByEmail: email,
  })
    .then((resource) => {
      if (resource.requestStatus === 'Pending') {
        Resource.findByIdAndDelete(id)
          .then((result) => {
            res.send({
              status: '200',
              message: 'Request Deleted',
            });
          })
          .catch((err) => {
            res.send({
              status: '500',
              message: 'Request Delete Failed',
              error: err,
            });
          });
      } else {
        res.send({
          status: '500',
          message: `Request Already Approved By ${resource.approvedByName}`,
        });
      }
    })
    .catch((err) => {
      res.send({
        status: '500',
        message: 'Request Delete Failed',
        error: err,
      });
    });
};

export const hideRequest = async (req, res) => {
  const { id, email } = req.body;
  await Resource.findOne({
    _id: id,
  })
    .then((resource) => {
      if (resource) {
        resource.ignoredBy.push(email);
        resource
          .save()
          .then((result) => {
            res.send({
              status: '200',
              message: 'Request Hidden',
            });
          })
          .catch((err) => {
            console.log(err);
            res.send({
              status: '500',
              message: 'Hiding Request Failed',
              error: err,
            });
          });
      } else {
        res.send({
          status: '500',
          message: 'Resource Request Not Found',
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.send({
        status: '500',
        message: 'Hiding Request Failed',
        error: err,
      });
    });
};
