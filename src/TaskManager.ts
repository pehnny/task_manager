import { rl } from "./global.js";
import { Options } from "./Options.js";
import { TaskManagerActions } from "./TaskManagerActions.js";
import * as dotenv from "dotenv";
import { DataTypes, Sequelize } from "sequelize";
import { Task } from "./Task.js";

export class TaskManager
{
    actions: TaskManagerActions
    connection: Sequelize

    constructor() {
        this.actions = new TaskManagerActions()
    }

    private displayOptions(): void
    {
        const options = `=> ${Options.Create} : to Create a new task\n`
        + `=> ${Options.Read} : to Read the task list\n`
        + `=> ${Options.Update} : to Update the status of a task\n`
        + `=> ${Options.Delete} : to Delete an existing task\n`
        + `=> ${Options.Filter} : to Read the tasks with a specific status\n`
        + `=> ${Options.Search} : to Search tasks containing a specific phrase\n`
        + `=> ${Options.Priority} : to Read tasks ordered by priority and status\n`
        + `=> ${Options.Exit} : to Exit the task manager\n`

        rl.write(options)
        this.displaySeparator()
    }

    private displaySeparator(): void
    {
        const separator = Array.from(new Array(40), () => "-").join("")
        rl.write(separator + "\n")
    }

    private connect(): Sequelize
    {
        const db = "task_manager"
        const user = new String(process.env.DB_USER).toString()
        const pwd = process.env.DB_PWD
        return new Sequelize(db, user, pwd, {host: "localhost", dialect: "mariadb", "timezone": "+02:00"})
    }

    private initDatabase(): void
    {
        Task.init
        (
            {
                "id":
                {
                    "type": DataTypes.INTEGER,
                    "autoIncrement": true,
                    "primaryKey": true
                },
                "description":
                {
                    "type": DataTypes.STRING,
                    "allowNull": false
                },
                "status":
                {
                    "type": DataTypes.STRING,
                    "allowNull": false,
                    "defaultValue": "pending"
                },
                "priority":
                {
                    "type": DataTypes.TINYINT,
                    "allowNull": false,
                    "defaultValue": 0
                }
            },
            {
                "sequelize": this.connection,
                "modelName": "Task",
                "charset": "latin1 COLLATE=latin1_general_ci",
                "engine": "InnoDB",
                "createdAt": "created_at",
                "updatedAt": "updated_at",
            }
        )
    }

    private async closeDatabase(): Promise<void>
    {
        await this.connection.close()
    }

    private async choseOption(): Promise<Options>
    {
        let userInput = await rl.question("Chose an action from the list above : ")
        userInput = userInput.trim().toLocaleLowerCase()

        switch (userInput) 
        {
            case Options.Create:
                await this.actions.createTask()
                break;
            case Options.Read:
                await this.actions.readTaskList()
                break;
            case Options.Update:
                await this.actions.updateTaskStatus()
                break;
            case Options.Delete:
                await this.actions.deleteTask()
                break;
            case Options.Filter:
                await this.actions.filterTaskList()
                break;
            case Options.Search:
                await this.actions.searchByKeyword()
                break;
            case Options.Priority:
                await this.actions.readPrioritySortedTaskList()
                break;
            case Options.Exit:
                break;
            default:
                rl.write("Unknown option !\n")
                this.displaySeparator()
                this.displayOptions()
                return this.choseOption()
        }

        this.displaySeparator()
        return userInput
    }

    async run(): Promise<void>
    {
        dotenv.config()

        try
        {
            this.connection = this.connect()
            this.connection.authenticate()
            rl.write("Connected to localhost !\n")
        }
        catch (error)
        {
            rl.write(error.message + "\n")
            return
        }

        try 
        {
            await this.initDatabase()
            rl.write("Using task_manager database !\n")
        } 
        catch (error) 
        {
            rl.write(error.message + "\n")
            return
        }

        rl.write("Welcome to your task manager !\n")
        rl.write("To interact with your list, enter an option from the list below.\n")
        this.displaySeparator()
        this.displayOptions()
        let userAction = await this.choseOption()

        while (userAction !== Options.Exit) 
        {
            this.displayOptions()
            userAction = await this.choseOption()
        }

        try 
        {
            await this.closeDatabase()
        } 
        catch (error) 
        {
            rl.write(error.message + "\n")
            return
        }

        rl.write("Exiting task manager...\n")
    }
}
