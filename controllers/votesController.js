const { ObjectId } = require('mongodb');
const votesServices = require('../services/votesServices');

// Get all votes
exports.getAll = (req, res) => {
  votesServices.getAll(res);
};

// Create one vote
exports.createOne = (req, res) => {
  const { body } = req;
  votesServices.createOne(body, res);
};

// Get one vote
exports.getOne = (req, res) => {
  const { id } = req.params;
  votesServices.getOne(ObjectId(id), res);
};

// Update one vote
exports.updateOne = (req, res) => {
  const { id } = req.params;
  const { body } = req;
  votesServices.updateOne(ObjectId(id), body, res);
};

// Delete one vote
exports.deleteOne = (req, res) => {
  const { id } = req.params;
  votesServices.deleteOne(ObjectId(id), res);
};

// Delete all votes
exports.deleteAll = (req, res) => {
  votesServices.deleteAll(res);
};
