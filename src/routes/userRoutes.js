const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.put('/status', userController.updateStatus);
router.get('/active', userController.countActiveUsers);
router.get('/inactive', userController.countInactiveUsers);

module.exports = router;
