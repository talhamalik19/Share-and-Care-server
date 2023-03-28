import Hospital from '../models/Hospital.js';

export const fetchDonations = (req, res) => {
  Hospital.find({})
    .then((result) => {
      res.send({
        status: '200',
        message: 'Donations Fetched Successfully',
        results: result,
      });
    })
    .catch((err) => {
      console.log('Error in fetchDonations', err);
      res.send({
        status: '500',
        message: 'Fetching Donations Failed',
        data: err,
      });
    });
};
