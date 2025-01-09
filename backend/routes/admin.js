const express = require('express');
const adminController = require('../controllers/adminController');
const authorizeAdmin = require('../middlewares/authorizeAdmin');
const taskCounter = require('../middlewares/taskCount');
const router = express.Router();

router.use(authorizeAdmin);
router.use(taskCounter);

router.get('/', adminController.listUsers);

router.put('/user/:id', adminController.updateUser);
router.delete('/user/:id', adminController.deleteUser);
router.get('/user/edit/:id', adminController.getEditId);

module.exports = router;
