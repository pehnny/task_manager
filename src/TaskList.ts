import { rl } from "./global.js"
import { Status } from "./Status.js"
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

    constructor(name: string = "to do list", user: string = "anonymous")
    {
        this.name = name
        this.user = user
        this.list = []
    }

    static from(taskList: TTaskList): TaskList
    {
        const newTaskList = new TaskList()
        newTaskList.name = taskList.name
        newTaskList.user = taskList.user
        newTaskList.list = taskList.list
        return newTaskList
    }

    private async choseTask(message: string): Promise<number>
    {
        this.readTaskList()
        const userInput = await rl.question(message)
        const taskNumber = parseInt(userInput) - 1

        return new Promise(
            (resolve, reject) =>
            {
                if (taskNumber < 0 || taskNumber >= this.list.length) {
                    reject(new Error("Unknown task number !\n"))
                }
                resolve(taskNumber)
            }
        )
    }

    async createTask(): Promise<void>
    {
        // TODO mariaDB implementation
        let userInput = await rl.question("Enter your task: ")
        userInput = userInput.trim()

        if (!userInput) {
            rl.write("Empty task forbidden !\n")
            return
        }

        const newTask = new Task(userInput)
        this.list.push(newTask)
        rl.write("Task successfully created !\n")
    }

    readTaskList(): void
    {
        // TODO mariaDB implementation
        if (this.list.length === 0) {
            rl.write("Your list is empty !\n")
            return
        }

        for (const [taskNumber, task] of this.list.entries()) {
            const {message, status} = task
            rl.write(`${taskNumber+1}: ${message} [${status}]\n`)
        }
    }

    async updateTaskStatus(): Promise<void>
    {
        // TODO mariaDB implementation
        let taskNumber: number

        try {
            taskNumber = await this.choseTask("Enter the number of the task you want to update : ")
        } catch (error) {
            rl.write(error.message)
            return
        }

        const task = this.list[taskNumber]

        for (const status of Object.values(Status)) {
            rl.write("=> " + status + "\n")
        }

        let newStatus = await rl.question("Chose the status you want to apply to your task : ")
        newStatus = newStatus.trim().toLocaleLowerCase()
        
        switch (newStatus) {
            case Status.Ongoing:
            case Status.Done:
                break;
            default:
                rl.write("Unknow status !\n")
                return
        }
        
        task.updateStatus(newStatus)
    }

    async deleteTask(): Promise<void>
    {
        // TODO mariaDB implementation
        let taskNumber: number

        try {
            taskNumber = await this.choseTask("Enter the number of the task you want to delete : ")
        } catch (error) {
            rl.write(error.message)
            return
        }

        const deletedTask = this.list.splice(taskNumber, 1)[0]
        rl.write(`${deletedTask.message} successfully deleted !\n`)
    }
}
