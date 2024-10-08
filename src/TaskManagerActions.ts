import { rl } from "./global.js"
import { Status } from "./Status.js"
import * as MariaDB from "mariadb";
import { Task } from "./Task.js";
import { YesOrNo } from "./YesOrNo.js";

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

    private async choseTask(message: string, connection: MariaDB.Connection): Promise<number>
    {
        const userInput = await rl.question(message)
        const id = parseInt(userInput)
        const query = await connection.query("SELECT id FROM tasks")
        const validIDs = query.map(task => task.id)

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

        if ("id" in task)
        {
            formatedTask += `${task.id} `
        }

        if ("description" in task)
        {
            formatedTask += `: ${task.description} `
        }

        if ("status" in task)
        {
            formatedTask += `[${task.status}] `
        }

        if ("priority" in task)
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

    private displayTasks(query: Array<Task>): void
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

    async createTask(connection: MariaDB.Connection): Promise<void>
    {
        let newTask = await rl.question("Enter your task: ")
        newTask = newTask.trim()

        if (!newTask)
        {
            rl.write("Empty task forbidden !\n")
            return
        }

        const priority = await this.askYesOrNo("Do you want to prioritize this task ?")
        let taskPriority: number

        switch (priority)
        {
            case YesOrNo.Yes:
                taskPriority = 1
                break;
            case YesOrNo.No:
                taskPriority = 0
                break;
        }

        rl.write(taskPriority.toString() + "\n")

        const query = await connection.query("INSERT INTO tasks(description, priority) VALUES (?, ?)", [newTask, taskPriority])
        rl.write("Task created !\n")
    }

    async readTaskList(connection: MariaDB.Connection): Promise<void>
    {
        const query = await connection.query("SELECT id, description, status, priority FROM tasks")
        this.displayTasks(query)
    }

    async updateTaskStatus(connection: MariaDB.Connection): Promise<void>
    {
        // TODO mariaDB implementation
        let id: number

        try 
        {
            await this.readTaskList(connection)
            const question = "Enter the id of the task you want to update : "
            id = await this.choseTask(question, connection)
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

        let newStatus = await rl.question("Chose the status you want to apply to your task : ")
        newStatus = newStatus.trim().toLowerCase()
        
        switch (newStatus) 
        {
            case Status.Pending:
            case Status.Done:
                break;
            default:
                rl.write("Unknow status !\n")
                return
        }
        
        const query = await connection.query("UPDATE tasks SET status = ? WHERE id = ?", [newStatus, id])
        rl.write("Task updated !\n")
    }

    async deleteTask(connection: MariaDB.Connection): Promise<void>
    {
        // TODO mariaDB implementation
        let id: number

        try 
        {
            await this.readTaskList(connection)
            const question = "Enter the id of the task you want to delete : "
            id = await this.choseTask(question, connection)
        } 
        catch (error) 
        {
            rl.write(error.message)
            return
        }

        const query = await connection.query("DELETE FROM tasks WHERE id = ?", [id])
        rl.write("Task deleted !\n")
    }

    async filterTaskList(connection: MariaDB.Connection): Promise<void> 
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

        const query = await connection.query("SELECT id, description, priority FROM tasks WHERE status = ?", [status])
        this.displayTasks(query)
    }

    async searchByKeyword(connection: MariaDB.Connection): Promise<void>
    {
        let keyword = await rl.question("Enter a keyword to search for specific tasks : ")
        keyword = keyword.trim().toLowerCase()
        keyword = `%${keyword}%`

        const query = await connection.query("SELECT id, description, status, priority FROM tasks WHERE description LIKE ?", [keyword])
        this.displayTasks(query)
    }

    async readPrioritySortedTaskList(connection: MariaDB.Connection): Promise<void>
    {
        const query = await connection.query
        (
            "SELECT id, description, status, priority FROM tasks "
            + "ORDER BY priority DESC, "
            + `CASE status WHEN '${Status.Pending}' THEN 0 WHEN '${Status.Done}' THEN 1 END,`
            + "status DESC,"
            + "id ASC;"
        )

        this.displayTasks(query)
    }
}
