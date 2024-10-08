import { rl } from "./global.js";
import { Options } from "./Options.js";
import { TaskManagerActions } from "./TaskManagerActions.js"
import * as MariaDB from "mariadb";
import * as dotenv from "dotenv";

export class TaskManager
{
    actions: TaskManagerActions
    connection: MariaDB.Connection

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

    private async connect(): Promise<MariaDB.Connection>
    {
        return MariaDB.createConnection
        (
            {
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PWD
            }
        )
    }

    private async initDatabase(): Promise<any>
    {
        await this.connection.query("CREATE DATABASE IF NOT EXISTS task_manager;")
        await this.connection.query("USE task_manager;")
        await this.connection.query
        (
            "CREATE TABLE IF NOT EXISTS tasks ("
            + "id int(10) unsigned NOT NULL AUTO_INCREMENT,"
            + "description varchar(100) NOT NULL,"
            + "status varchar(50) NOT NULL DEFAULT 'pending',"
            + "created_at datetime NOT NULL DEFAULT current_timestamp(),"
            + "updated_at datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),"
            + "priority TINYINT(1) NOT NULL DEFAULT '0',"
            + "PRIMARY KEY (id)"
            + ") ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;"
        )
    }

    private async closeDatabase(): Promise<void>
    {
        await this.connection.end()
    }

    private async choseOption(): Promise<Options>
    {
        let userInput = await rl.question("Chose an action from the list above : ")
        userInput = userInput.trim().toLocaleLowerCase()

        switch (userInput) 
        {
            case Options.Create:
                await this.actions.createTask(this.connection)
                break;
            case Options.Read:
                await this.actions.readTaskList(this.connection)
                break;
            case Options.Update:
                await this.actions.updateTaskStatus(this.connection)
                break;
            case Options.Delete:
                await this.actions.deleteTask(this.connection)
                break;
            case Options.Filter:
                await this.actions.filterTaskList(this.connection)
                break;
            case Options.Search:
                await this.actions.searchByKeyword(this.connection)
                break;
            case Options.Priority:
                await this.actions.readPrioritySortedTaskList(this.connection)
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
            this.connection = await this.connect()
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
