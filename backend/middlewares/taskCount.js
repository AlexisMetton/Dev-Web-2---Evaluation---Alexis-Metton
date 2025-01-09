const Task = require('../models/task');

async function taskCounter(req, res, next) {
    try {
        if (req.session?.user?.id) {
         
            const tasks = await Task.getAllByUser(req.session.user.id);
            res.locals.remainingTasks = tasks.filter(task => !task.completed).length;

            const userRoles = req.session.user.roles || [];
            res.locals.isAdmin = userRoles.includes('ROLE_ADMIN');

        } else {
            res.locals.remainingTasks = null;
            res.locals.isAdmin = false;
        }
    } catch (error) {
        res.locals.remainingTasks = 0;
        res.locals.isAdmin = false;
    }
    next();
}

module.exports = taskCounter;
