import { Task } from "./Task.js"

type TTaskList =
{
    name: string
    user: string
    list: Task[]
}

export class TaskList implements TTaskList
{   
    name: string
    user: string
    list: Task[]

    static from(taskList: TTaskList): TaskList
    {
        const newTaskList = new TaskList()
        newTaskList.name = taskList.name
        newTaskList.user = taskList.user
        newTaskList.list = taskList.list
        return newTaskList
    }

    createTask(): void
    {
        // TODO mariaDB implementation
    }

    readTaskList(): void
    {
        // TODO mariaDB implementation
    }

    updateTask(): void
    {
        // TODO mariaDB implementation
    }

    deleteTask(): void
    {
        // TODO mariaDB implementation
    }
}
