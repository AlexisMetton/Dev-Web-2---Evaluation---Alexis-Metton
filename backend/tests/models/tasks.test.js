const Task = require('../../models/task');

jest.mock('../../models/task');

describe('Task Model', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should fetch all tasks for a user', async () => {
        const mockTasks = [
            { id: 1, title: 'Task 1', description: 'Description 1', completed: false, user_id: 1 },
            { id: 2, title: 'Task 2', description: 'Description 2', completed: true, user_id: 1 },
        ];
        Task.getAllByUser.mockResolvedValue(mockTasks);

        const result = await Task.getAllByUser(1);

        expect(result).toEqual(mockTasks);
        expect(Task.getAllByUser).toHaveBeenCalledWith(1);
    });

    test('should create a task successfully', async () => {
        const mockTask = {
            id: 1,
            title: 'Task 1',
            description: 'Description 1',
            completed: false,
            user_id: 1,
        };
        Task.create.mockResolvedValue(mockTask);

        const result = await Task.create({
            title: 'Task 1',
            description: 'Description 1',
            completed: false,
            user_id: 1,
        });

        expect(result).toEqual(mockTask);
        expect(Task.create).toHaveBeenCalledWith({
            title: 'Task 1',
            description: 'Description 1',
            completed: false,
            user_id: 1,
        });
    });

    test('should update a task successfully', async () => {
        const updatedTask = {
            id: 1,
            title: 'Updated Task',
            description: 'Updated Description',
            completed: true,
        };
        Task.update.mockResolvedValue(updatedTask);

        const result = await Task.update(1, {
            title: 'Updated Task',
            description: 'Updated Description',
            completed: true,
        });

        expect(result).toEqual(updatedTask);
        expect(Task.update).toHaveBeenCalledWith(1, {
            title: 'Updated Task',
            description: 'Updated Description',
            completed: true,
        });
    });

    test('should throw an error if task to update is not found', async () => {
        Task.update.mockRejectedValue(new Error('Task not found'));

        await expect(
            Task.update(99, {
                title: 'Non-existent Task',
                description: 'Description',
                completed: false,
            })
        ).rejects.toThrow('Task not found');
        expect(Task.update).toHaveBeenCalledWith(99, {
            title: 'Non-existent Task',
            description: 'Description',
            completed: false,
        });
    });

    test('should delete a task successfully', async () => {
        Task.delete.mockResolvedValue(1);

        const result = await Task.delete(1);

        expect(result).toBe(1);
        expect(Task.delete).toHaveBeenCalledWith(1);
    });

    test('should throw an error if task to delete is not found', async () => {
        Task.delete.mockRejectedValue(new Error('Task not found'));

        await expect(Task.delete(99)).rejects.toThrow('Task not found');
        expect(Task.delete).toHaveBeenCalledWith(99);
    });
});
