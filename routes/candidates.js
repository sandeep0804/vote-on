const express = require('express');
const candidatesController = require('../controllers/candidatesController');

const router = express.Router();

// Get all candidates
router.get('/', candidatesController.getAll);

// Create one candidate
router.post('/', candidatesController.createOne);

// Delete all candidates
router.delete('/', candidatesController.deleteAll);

// Get one candidate
router.get('/:id', candidatesController.getOne);

// Update one candidate
router.put('/:id', candidatesController.updateOne);

// Delete one candidate
router.delete('/:id', candidatesController.deleteOne);

module.exports = router;
