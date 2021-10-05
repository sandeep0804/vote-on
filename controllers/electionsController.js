const { ObjectId } = require('mongodb');
const electionsServices = require('../services/electionsServices');

// Get all elections
exports.getAll = (req, res) => {
  electionsServices.getAll(res);
};

// Get all running elections
exports.getAllRunning = (req, res) => {
  electionsServices.getAllRunning(res);
};

// Get all elections results
exports.getAllResults = (req, res) => {
  electionsServices.getAllResults(res);
};

// Create one election
exports.createOne = (req, res) => {
  const { body } = req;
  electionsServices.createOne(body, res);
};

// Get one election
exports.getOne = (req, res) => {
  const { id } = req.params;
  electionsServices.getOne(ObjectId(id), res);
};

// Update one election
exports.updateOne = (req, res) => {
  const { id } = req.params;
  const { body } = req;
  electionsServices.updateOne(ObjectId(id), body, res);
};

// Delete one election
exports.deleteOne = (req, res) => {
  const { id } = req.params;
  electionsServices.deleteOne(ObjectId(id), res);
};

// Delete all elections
exports.deleteAll = (req, res) => {
  electionsServices.deleteAll(res);
};
