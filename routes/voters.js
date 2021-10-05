const express = require('express');
const votersController = require('../controllers/votersController');

const router = express.Router();

// Get all voters
router.get('/', votersController.getAll);

// Create one voter
router.post('/', votersController.createOne);

// Delete all voters
router.delete('/', votersController.deleteAll);

// Login
router.post('/login', votersController.login);

// Get one voter
router.get('/:id', votersController.getOne);

// Update one voter
router.put('/:id', votersController.updateOne);

// Delete one voter
router.delete('/:id', votersController.deleteOne);

module.exports = router;
