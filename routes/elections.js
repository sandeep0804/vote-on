const express = require('express');
const electionsController = require('../controllers/electionsController');

const router = express.Router();

// Get all elections
router.get('/', electionsController.getAll);

// Get all running elections
router.get('/running', electionsController.getAllRunning);

// Get all elections results
router.get('/results', electionsController.getAllResults);

// Create one election
router.post('/', electionsController.createOne);

// Delete all elections
router.delete('/', electionsController.deleteAll);

// Get one election
router.get('/:id', electionsController.getOne);

// Update one election
router.put('/:id', electionsController.updateOne);

// Delete one election
router.delete('/:id', electionsController.deleteOne);

module.exports = router;
