import { rl } from "./global.js"
import { Status } from "./Status.js"
import * as MariaDB from "mariadb";

export class TaskList
{   
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

    async createTask(connection: MariaDB.Connection): Promise<void>
    {
        let newTask = await rl.question("Enter your task: ")
        newTask = newTask.trim()

        if (!newTask)
        {
            rl.write("Empty task forbidden !\n")
            return
        }

        const query = await connection.query("INSERT INTO tasks(description) VALUES (?)", [newTask])
        rl.write("Task created !\n")
    }

    async readTaskList(connection: MariaDB.Connection): Promise<void>
    {
        const query = await connection.query("SELECT id, description, status FROM tasks")

        if (query.length < 1)
        {
            rl.write("You list is empty !\n")
            return
        }

        for (const line of query)
        {
            const task = `${line.id} : ${line.description} [${line.status}]\n`
            rl.write(task)
        }
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
        newStatus = newStatus.trim().toLocaleLowerCase()
        
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
}
