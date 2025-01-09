const Task = require('../models/task');

module.exports = {
    getAllByUser: async (req, res) => {
        try {
            const tasks = await Task.getAllByUser(req.user.id);
            const remainingTasks = tasks.filter(task => !task.completed).length;
            //res.locals.remainingTasks = remainingTasks;
            res.status(200).json({
                success: true,
                tasks,
                remainingTasks,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la récupération des tâches.',
            });
        }
    },

    createTask: async (req, res) => {
        const { title, description, completed = false } = req.body;
        try {
            const task = await Task.create({ title, description, completed, user_id: req.user.id });
            res.status(201).json({
                success: true,
                message: 'Tâche créée avec succès.',
                task,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la création de la tâche.',
            });
        }
    },

    updateTask: async (req, res) => {
        const { id } = req.params;
        const { title, description, completed } = req.body;
        try {
            const task = await Task.update(id, { title, description, completed });
            res.status(200).json({
                success: true,
                message: 'Tâche mise à jour avec succès.',
                task,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la mise à jour de la tâche.',
            });
        }
    },

    deleteTask: async (req, res) => {
        const { id } = req.params;
        try {
            await Task.delete(id);
            res.status(200).json({
                success: true,
                message: 'Tâche supprimée avec succès.',
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la suppression de la tâche.',
            });
        }
    },   

    getEditId: async (req, res) => {
        const taskId = req.params.id;
        
        try {
            const { task } = await Task.getTaskId(taskId);

            if(task.error){
                return res.status(404).json({
                    success: false,
                    error: 'Tâche introuvable.',
                });
            } 
            
            res.status(200).json({
                success: true,
                task,
            });
            
            //res.render('dashboard', { tasks, user: req.user });
        } catch (err) {
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la récupération de la tâche.',
            });
        }
    },

    // updateTask: async (req, res) => {
    //     const { id } = req.params;
    //     const { title, description, completed } = req.body;
        
    //     try {
    //         const task = await Task.update(id, { title, description, completed });
    //         res.json({ success: true, task });
    //     } catch (err) {
    //         res.status(404).json({ success: false, error: err.message });
    //     }
    // },
    
};
