const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/authenticate');
const tasksController = require('../controllers/tasksController');
const taskCounter = require('../middlewares/taskCount');

// Middleware pour protéger toutes les routes de /tasks
router.use(isAuthenticated);
router.use(taskCounter);

// Routes pour les tâches
router.get('/', tasksController.getAllByUser);

router.post('/', tasksController.createTask);
router.put('/:id', tasksController.updateTask);
router.delete('/:id', tasksController.deleteTask);
router.get('/edit/:id', tasksController.getEditId);

module.exports = router;
