const express = require('express');
const adminController = require('../controllers/adminController');
const authorizeAdmin = require('../middlewares/authorizeAdmin');
const taskCounter = require('../middlewares/taskCount');
const router = express.Router();

router.use(authorizeAdmin(['ROLE_ADMIN', 'ROLE_SUPERADMIN']));
router.use(taskCounter);

router.get('/', adminController.listUsers);

router.post('/user', adminController.createUser);
router.put('/user/:id', adminController.updateUser);
router.delete('/user/:id', adminController.deleteUser);
router.get('/user/edit/:id', adminController.getEditId);

router.post('/tasks/:userId', adminController.createTasks);
router.put('/tasks/:id', adminController.updateTasks);
router.delete('/tasks/:userId/:taskId', adminController.deleteTasks);
router.get('/tasks/:userId', adminController.getTasksUser);

module.exports = router;
