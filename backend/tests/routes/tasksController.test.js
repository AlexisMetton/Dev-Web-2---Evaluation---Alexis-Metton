const Task = require('../../models/task');
const tasksController = require('../../controllers/tasksController');

jest.mock('../../models/task');

describe('Tasks Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            user: { id: 1, username: 'testuser' },
            params: {},
            body: {},
            session: {
                user: { id: 1, username: 'testuser' },
            },
        };
        res = {
            status: jest.fn(() => res),
            json: jest.fn(),
            send: jest.fn(),
            redirect: jest.fn(),
            render: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllByUser', () => {
        test('should retrieve all tasks for a user', async () => {
            const mockTasks = [
                { id: 1, title: 'Task 1', description: 'Desc 1', completed: false, user_id: 1 },
                { id: 2, title: 'Task 2', description: 'Desc 2', completed: true, user_id: 1 },
            ];

            Task.getAllByUser.mockResolvedValue(mockTasks);

            await tasksController.getAllByUser(req, res);

            expect(Task.getAllByUser).toHaveBeenCalledWith(req.user.id);

            const remainingTasks = mockTasks.filter(task => !task.completed).length;
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                tasks: mockTasks,
                remainingTasks,
            });
        });

        test('should handle errors during task retrieval', async () => {
            Task.getAllByUser.mockRejectedValue(new Error('Database error'));

            await tasksController.getAllByUser(req, res);

            expect(Task.getAllByUser).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: 'Erreur lors de la récupération des tâches.',
            });
        });
    });

    describe('createTask', () => {
        test('should create a new task', async () => {
            req.body = { title: 'New Task', description: 'New Description', completed: false };

            const mockTask = { id: 1, ...req.body, user_id: req.user.id };

            Task.create.mockResolvedValue(mockTask);

            await tasksController.createTask(req, res);

            expect(Task.create).toHaveBeenCalledWith({
                title: 'New Task',
                description: 'New Description',
                completed: false,
                user_id: 1,
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Tâche créée avec succès.',
                task: mockTask,
            });
        });

        test('should handle errors during task creation', async () => {
            req.body = { title: 'New Task', description: 'New Description', completed: false };

            Task.create.mockRejectedValue(new Error('Database error'));

            await tasksController.createTask(req, res);

            expect(Task.create).toHaveBeenCalledWith({
                title: 'New Task',
                description: 'New Description',
                completed: false,
                user_id: 1,
            });
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: 'Erreur lors de la création de la tâche.',
            });
        });
    });

    describe('updateTask', () => {
        test('should update a task successfully', async () => {
            req.params = { id: 1 };
            req.body = { title: 'Updated Task', description: 'Updated Description', completed: true };

            const updatedTask = { id: 1, ...req.body };

            Task.update.mockResolvedValue(updatedTask);

            await tasksController.updateTask(req, res);

            expect(Task.update).toHaveBeenCalledWith(1, req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Tâche mise à jour avec succès.',
                task: updatedTask,
            });
        });

        test('should handle errors during task update', async () => {
            req.params = { id: 1 };
            req.body = { title: 'Updated Task', description: 'Updated Description', completed: true };

            Task.update.mockRejectedValue(new Error('Task not found'));

            await tasksController.updateTask(req, res);

            expect(Task.update).toHaveBeenCalledWith(1, req.body);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: 'Erreur lors de la mise à jour de la tâche.',
            });
        });
    });

    describe('deleteTask', () => {
        test('should delete a task successfully', async () => {
            req.params = { id: 1 };

            Task.delete.mockResolvedValue(1);

            await tasksController.deleteTask(req, res);

            expect(Task.delete).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Tâche supprimée avec succès.',
            });
        });

        test('should handle errors during task deletion', async () => {
            req.params = { id: 1 };

            Task.delete.mockRejectedValue(new Error('Task not found'));

            await tasksController.deleteTask(req, res);

            expect(Task.delete).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: 'Erreur lors de la suppression de la tâche.',
            });
        });
    });

    describe('getEditId', () => {
        test('should retrieve task by ID and render edit page', async () => {
            req.params = { id: 1 };

            const mockTask = { id: 1, title: 'Task 1', description: 'Desc 1', completed: false };

            Task.getTaskId.mockResolvedValue({ task: mockTask });

            await tasksController.getEditId(req, res);

            expect(Task.getTaskId).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                task: mockTask,
            });
        });

        test('should handle errors during task retrieval by ID', async () => {
            req.params = { id: 1 };

            Task.getTaskId.mockRejectedValue(new Error('Task not found'));

            await tasksController.getEditId(req, res);

            expect(Task.getTaskId).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: 'Erreur lors de la récupération de la tâche.',
            });
        });
    });
});
