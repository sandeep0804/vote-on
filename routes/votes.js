const express = require('express');
const votesController = require('../controllers/votesController');

const router = express.Router();

// Get all votes
router.get('/', votesController.getAll);

// Create one vote
router.post('/', votesController.createOne);

// Delete all votes
router.delete('/', votesController.deleteAll);

// Get one vote
router.get('/:id', votesController.getOne);

// Update one vote
router.put('/:id', votesController.updateOne);

// Delete one vote
router.delete('/:id', votesController.deleteOne);

module.exports = router;
