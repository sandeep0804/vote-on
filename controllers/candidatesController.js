const { ObjectId } = require('mongodb');
const candidatesServices = require('../services/candidatesServices');

// Get all candidates
exports.getAll = (req, res) => {
  candidatesServices.getAll(res);
};

// Create one candidate
exports.createOne = (req, res) => {
  const { body } = req;
  candidatesServices.createOne(body, res);
};

// Get one candidate
exports.getOne = (req, res) => {
  const { id } = req.params;
  candidatesServices.getOne(ObjectId(id), res);
};

// Update one candidate
exports.updateOne = (req, res) => {
  const { id } = req.params;
  const { body } = req;
  candidatesServices.updateOne(ObjectId(id), body, res);
};

// Delete one candidate
exports.deleteOne = (req, res) => {
  const { id } = req.params;
  candidatesServices.deleteOne(ObjectId(id), res);
};

// Delete all candidates
exports.deleteAll = (req, res) => {
  candidatesServices.deleteAll(res);
};
