import Task from '../schemas/Tasks.js';

class TaskController {
    async update(req, res) {
        const taskId = req.body.taskId;

        if(!taskId) return res.status(400).send({ error: 'TaskId must be suplied'});

        const task  = await Task.findById(taskId);

        if(task.completed) {
            task.completed = false;
        } else {
            task.completed = true;
        }

        task.save();

        return res.json(task);


    }
}

export default new TaskController();