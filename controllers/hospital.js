import Hospital from '../models/Hospital.js';
import Volunteer from '../models/Volunteer.js';
import Resource from '../models/Resource.js';

export const signup = async (req, res) => {
  const { name, email, password, phone, website, address } = req.body;
  console.log(req.body);

  await Hospital.findOne({ email })
    .then(async (hospital) => {
      if (hospital) {
        res.send({ status: '400', message: 'Account Already Exists' });
      } else {
        const newHospital = new Hospital({
          name,
          email,
          password,
          phone,
          website,
          address,
        });

        await newHospital
          .hashPassword(password)
          .then(() => {
            res.send({
              status: '201',
              message: 'SignUp Successful',
            });
            console.log(newHospital);
          })
          .catch((err) => {
            res.send({ status: '500', message: 'Signup Failed' });
            console.log(err);
          });
      }
    })
    .catch((err) => {
      res.send({ status: '500', message: 'Error SigningUp' });
      console.log(err);
    });
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  await Hospital.findOne({ email })
    .then(async (hospital) => {
      if (!hospital) {
        res.send({ status: '400', message: 'Account Does Not Exist' });
      } else {
        await hospital
          .validatePassword(password)
          .then(async (isMatch) => {
            if (isMatch) {
              await hospital
                .generateAuthToken()
                .then(() => {
                  console.log(hospital);
                  res.send({
                    status: '200',
                    message: 'SignIn Successful',
                    hospital: hospital,
                  });
                })
                .catch((err) => {
                  res.send({ status: '500', message: 'Error SigningIn' });
                  console.log(err);
                });
            } else {
              res.send({ status: '400', message: 'Invalid Password' });
            }
          })
          .catch((err) => {
            console.log(err);
            res.send({ status: '500', message: 'Error SigningIn' });
          });
      }
    })
    .catch((err) => {
      res.send({ status: '500', message: 'Error Signing In' });
    });
};

export const updateAccount = async (req, res) => {
  const { name, email, token, phone, website, address } = req.body;
  await Hospital.findOne({ email })
    .then(async (hospital) => {
      if (!hospital) {
        res.send({ status: '400', message: 'Account Does Not Exist' });
      } else {
        await hospital.validateToken(token).then(async (isMatch) => {
          if (isMatch) {
            await hospital
              .updateAccount(name, phone, website, address)
              .then(() => {
                res.send({
                  status: '200',
                  message: 'Account Updated',
                  hospital,
                });
              })
              .catch((err) => {
                console.log(err);
                res.send({ status: '500', message: 'Updating Account Failed' });
              });
          } else {
            res.send({ status: '400', message: 'Invalid Token' });
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.send({ status: '500', message: 'Error Updating Account' });
    });
};

export const updatePassword = async (req, res) => {
  const { email, token, password, newPassword } = req.body;
  await Hospital.findOne({ email })
    .then(async (hospital) => {
      if (!hospital) {
        res.send({ status: '400', message: 'Account Does Not Exist' });
      } else {
        await hospital.validateToken(token).then(async (isMatch) => {
          if (isMatch) {
            await hospital
              .validatePassword(password)
              .then(async (isMatch) => {
                if (isMatch) {
                  await hospital
                    .hashPassword(newPassword)
                    .then(() => {
                      res.send({
                        status: '200',
                        message: 'Password Updated',
                        hospital,
                      });
                    })
                    .catch((err) => {
                      console.log(err);
                      res.send({
                        status: '500',
                        message: 'Updating Password Failed',
                      });
                    });
                } else {
                  res.send({ status: '400', message: 'Invalid Password' });
                }
              })
              .catch((err) => {
                console.log(err);
                res.send({ status: '500', message: 'Error Updating Password' });
              });
          } else {
            res.send({ status: '400', message: 'Invalid Token' });
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.send({ status: '500', message: 'Error Updating Password' });
    });
};

export const deleteAccount = async (req, res) => {
  const { email, token } = req.body;
  console.log(req.body);

  await Hospital.findOne({ email })
    .then(async (hospital) => {
      if (!hospital) {
        res.send({ status: '400', message: 'Account Does Not Exist' });
      } else {
        await hospital.validateToken(token).then(async (isValid) => {
          if (isValid) {
            await Hospital.findByIdAndDelete(hospital._id)
              .then(() => {
                res.send({ status: '200', message: 'Account Deleted' });
              })
              .catch((err) => {
                res.send({ status: '500', message: 'Deleting Account Failed' });
              });
          } else {
            res.send({ status: '400', message: 'Invalid Password' });
          }
        });
      }
    })
    .catch((err) => {
      res.send({ status: '500', message: 'Deleting Account Failed' });
    });
};

export const signout = async (req, res) => {
  const { email, token } = req.body;
  console.log(req.body);

  await Hospital.findOne({ email })
    .then(async (hospital) => {
      if (!hospital) {
        res.send({ status: '400', message: 'Account Does Not Exist' });
      } else {
        await hospital.validateToken(token).then(async (isMatch) => {
          if (isMatch) {
            await hospital
              .removeToken()
              .then(() => {
                res.send({ status: '200', message: 'SignOut Successful' });
              })
              .catch((err) => {
                res.send({ status: '500', message: 'Error SigningOut' });
              });
          } else {
            res.send({ status: '400', message: 'Invalid Password' });
          }
        });
      }
    })
    .catch((err) => {
      res.send({ status: '500', message: 'Error SigningOut' });
    });
};

export const fetchStats = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(req.body);
    var hospitalRecord = {
      resources: {
        requestsMadeByHospitalTotal: 0,
        requestsMadeByHospitalApproved: 0,
        requestsMadeByHospitalPending: 0,
        requestsApprovedByHospital: 0,
      },
      volunteers: {
        requestsMadeByHospitalTotal: 0,
        approvedVolunteers: 0,
        pendingVolunteers: 0,
        totalVolunteers: 0,
      },
    };
    await Hospital.findOne({ email })
      .then(async (hospital) => {
        if (!hospital) {
          res.send({ status: '400', message: 'Account Does Not Exist' });
        } else {
          try {
            await Resource.find({ requestedByEmail: email })
              .then((resources) => {
                hospitalRecord.resources.requestsMadeByHospitalTotal =
                  resources.length;
                resources.forEach((resource) => {
                  if (resource.requestStatus === 'Approved') {
                    hospitalRecord.resources.requestsMadeByHospitalApproved++;
                  } else if (resource.requestStatus === 'Pending') {
                    hospitalRecord.resources.requestsMadeByHospitalPending++;
                  }
                });
              })
              .catch((err) => {
                console.log(err);
              });

            await Resource.find({ approvedByEmail: email })
              .then((resources) => {
                hospitalRecord.resources.requestsApprovedByHospital =
                  resources.length;
              })
              .catch((err) => {
                console.log(err);
              });

            await Volunteer.find({ hospitalEmail: email })
              .then((volunteerRequests) => {
                hospitalRecord.volunteers.requestsMadeByHospitalTotal =
                  volunteerRequests.length;

                volunteerRequests.forEach((volunteerReq) => {
                  volunteerReq.applicants.forEach((applicant) => {
                    if (applicant.applicantRequestStatus === 'Approved') {
                      hospitalRecord.volunteers.approvedVolunteers++;
                    }
                    if (applicant.applicantRequestStatus === 'Applied') {
                      hospitalRecord.volunteers.pendingVolunteers++;
                    }

                    hospitalRecord.volunteers.totalVolunteers++;
                  });
                });
              })
              .catch((err) => {
                console.log(err);
              });
            res.send({
              status: '200',
              message: 'Requests Count Fetched',
              hospitalRecord,
            });
          } catch (err) {
            console.log(err);
            res.send({ status: '500', message: 'Error' });
          }
        }
      })
      .catch((err) => {
        console.log(err);
        res.send({ status: '500', message: 'Error' });
      });
  } catch (err) {
    console.log(err);
    res.send({ status: '500', message: 'Error' });
  }
};
