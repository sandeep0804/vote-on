const { ObjectId } = require('mongodb');
const votersServices = require('../services/votersServices');

// Get all voters
exports.getAll = (req, res) => {
  votersServices.getAll(res);
};

// Create one voter
exports.createOne = (req, res) => {
  const { body } = req;
  votersServices.createOne(body, res);
};

// Get one voter
exports.getOne = (req, res) => {
  const { id } = req.params;
  votersServices.getOne(ObjectId(id), res);
};

// Update one voter
exports.updateOne = (req, res) => {
  const { id } = req.params;
  const { body } = req;
  votersServices.updateOne(ObjectId(id), body, res);
};

// Delete one voter
exports.deleteOne = (req, res) => {
  const { id } = req.params;
  votersServices.deleteOne(ObjectId(id), res);
};

// Delete all voters
exports.deleteAll = (req, res) => {
  votersServices.deleteAll(res);
};

// Login
exports.login = (req, res) => {
  const { body } = req;
  votersServices.login(body, res);
};
