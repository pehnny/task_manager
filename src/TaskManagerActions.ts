import { rl } from "./global.js"
import { Status } from "./Status.js"
import { Task } from "./Task.js";
import { YesOrNo } from "./YesOrNo.js";
import { Op, Sequelize } from "sequelize";

export class TaskManagerActions
{
    private async askYesOrNo(message: string): Promise<YesOrNo>
    {
        const question = message + " yes or no : "
        let userInput = await rl.question(question)
        userInput = userInput.trim().toLowerCase()

        switch (userInput)
        {
            case YesOrNo.Yes:
            case YesOrNo.No:
                return userInput
            default:
                return this.askYesOrNo(message)
        }
    }

    private async choseTask(message: string): Promise<number>
    {
        const userInput = await rl.question(message)
        const id = parseInt(userInput)
        
        const attributes = ["id"]
        const tasks = await Task.findAll({attributes})
        const validIDs = tasks.map(task => task.id)

        return new Promise
        (
            (resolve, reject) =>
            {
                if (!validIDs.includes(id))
                {
                    reject(new Error("Invalid ID !\n"))
                }

                resolve(id)
            }
        )
    }

    private formatTask(task: Task): string
    {
        let formatedTask = ""

        if (task.id !== undefined)
        {
            formatedTask += `${task.id} `
        }

        if (task.description !== undefined)
        {
            formatedTask += `: ${task.description} `
        }

        if (task.status !== undefined)
        {
            formatedTask += `[${task.status}] `
        }

        if (task.priority !== undefined)
        {
            const priority = task.priority

            switch (priority)
            {
                case 0:
                    formatedTask += "\{common\} "
                    break;
                case 1:
                    formatedTask += "\{prioritized\} "
                    break;
            }
        }

        return formatedTask + "\n"
    }

    private displayTasks(query: Task[]): void
    {
        if (query.length < 1)
        {
            rl.write("You list is empty !\n")
            return
        }

        for (const line of query)
        {
            const task = this.formatTask(line)
            rl.write(task)
        }
    }

    async createTask(): Promise<void>
    {
        let description = await rl.question("Enter your task: ")
        description = description.trim()

        if (!description)
        {
            rl.write("Empty task forbidden !\n")
            return
        }

        const userInput = await this.askYesOrNo("Do you want to prioritize this task ?")
        let priority: number

        switch (userInput)
        {
            case YesOrNo.Yes:
                priority = 1
                break;
            case YesOrNo.No:
                priority = 0
                break;
        }

        const newTask = await Task.create({description, priority}) 
        rl.write("Task created !\n")
    }

    async readTaskList(): Promise<void>
    {
        const attributes = ["id", "description", "status", "priority"]
        const tasks = await Task.findAll({attributes})
        this.displayTasks(tasks)
    }

    async updateTaskStatus(): Promise<void>
    {
        let id: number

        try 
        {
            await this.readTaskList()
            const question = "Enter the id of the task you want to update : "
            id = await this.choseTask(question)
        } 
        catch (error) 
        {
            rl.write(error.message)
            return
        }

        for (const status of Object.values(Status))
        {
            rl.write("=> " + status + "\n")
        }

        let status = await rl.question("Chose the status you want to apply to your task : ")
        status = status.trim().toLowerCase()
        
        switch (status) 
        {
            case Status.Pending:
            case Status.Done:
                break;
            default:
                rl.write("Unknow status !\n")
                return
        }
        
        const where = {id}
        const affected = await Task.update({status}, {where})
        rl.write("Task updated !\n")
    }

    async deleteTask(): Promise<void>
    {
        let id: number

        try 
        {
            await this.readTaskList()
            const question = "Enter the id of the task you want to delete : "
            id = await this.choseTask(question)
        } 
        catch (error) 
        {
            rl.write(error.message)
            return
        }

        const where = {id}
        const row = await Task.destroy({where})
        rl.write("Task deleted !\n")
    }

    async filterTaskList(): Promise<void> 
    {
        for (const status of Object.values(Status))
        {
            rl.write("=> " + status + "\n")
        }

        let status = await rl.question("Chose a status from the list above to show specific tasks : ")
        status = status.trim().toLowerCase()

        switch (status) 
        {
            case Status.Pending:
            case Status.Done:
                break;
            default:
                rl.write("Unknow status !\n")
                return
        }

        const attributes = ["id", "description", "priority"]
        const where = {status}
        const tasks = await Task.findAll({attributes, where})
        this.displayTasks(tasks)
    }

    async searchByKeyword(): Promise<void>
    {
        let keyword = await rl.question("Enter a keyword to search for specific tasks : ")
        keyword = keyword.trim()
        keyword = `%${keyword}%`

        const attributes = ["id", "description", "status", "priority"]
        const description = {[Op.like]: keyword}
        const where = {description}
        const tasks = await Task.findAll({attributes, where})
        this.displayTasks(tasks)
    }

    async readPrioritySortedTaskList(): Promise<void>
    {
        const attributes = ["id", "description", "status", "priority"]
        const statusOrder = Sequelize.literal(`CASE status WHEN '${Status.Pending}' THEN 0 WHEN '${Status.Done}' THEN 1 END, status`)
        const tasks = await Task.findAll({attributes, order: [["priority", "DESC"], [statusOrder, "DESC"], ["id", "ASC"]]})
        this.displayTasks(tasks)
    }
}
