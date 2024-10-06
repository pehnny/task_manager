import { Status } from "./Status.js"

type TTask =
{
    message: string
    status: Status
}

export class Task implements TTask
{
    message: string
    status: Status

    constructor(message: string, status: Status = Status.Ongoing)
    {
        this.message = message
        this.status = status
    }

    static from(task: TTask): Task
    {
        const newTask = new Task("")
        newTask.message = task.message
        newTask.status = task.status
        return newTask
    }

    updateStatus(status: Status): void
    {
        this.status = status
    }
}
