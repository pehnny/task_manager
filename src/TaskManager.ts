import { rl, saveFile } from "./global.js";
import { Options } from "./Options.js";
import { TaskList } from "./TaskList.js"
import { readFileSync, writeFileSync, existsSync } from "fs";
import { Task } from "./Task.js";
import { YesOrNo } from "./YesOrNo.js";

export class TaskManager
{
    taskList: TaskList

    private async askYesOrNo(message: string): Promise<YesOrNo>
    {
        const question = message + " yes or no : "
        let userInput = await rl.question(question)
        userInput = userInput.trim().toLowerCase()

        switch (userInput) {
            case YesOrNo.Yes:
            case YesOrNo.No:
                break;
            default:
                rl.write("Wrong input !\n")
                return this.askYesOrNo(message)
        }
        
        return userInput
    }

    private displayOptions(): void
    {
        const options = `=> ${Options.Create} : to Create a new task\n`
        + `=> ${Options.Read} : to Read the task list\n`
        + `=> ${Options.Update} : to Update the status of a task\n`
        + `=> ${Options.Delete} : to Delete an existing task\n`
        + `=> ${Options.Exit} : to Exit the task manager\n`

        rl.write(options)
        this.displaySeparator()
    }

    private displaySeparator(): void
    {
        const separator = Array.from(new Array(40), () => "-").join("")
        rl.write(separator + "\n")
    }

    private async loadTaskList(): Promise<void>
    {
        // TODO load tasklist
        if (!existsSync(saveFile)) {
            this.taskList = new TaskList()
            return
        }

        const userInput = await this.askYesOrNo("Do you want to load your task list ?")

        if (userInput === YesOrNo.No) {
            this.taskList = new TaskList()
            return
        } 

        const data = JSON.parse(readFileSync(saveFile).toString())
        data.list = data.list.map(task => Task.from(task))
        this.taskList = TaskList.from(data)
    }

    private async saveTaskList(): Promise<void>
    {
        // TODO save tasklist
        const userInput = await this.askYesOrNo("Do you want to save your task list ?")

        if (userInput === YesOrNo.Yes) {
            writeFileSync(saveFile, JSON.stringify(this.taskList, null, 4))
            rl.write("Saving your taskList....\n")
        }
    }

    private async choseOption(): Promise<Options>
    {
        let userInput = await rl.question("Chose an action from the list above : ")
        userInput = userInput.trim().toLocaleLowerCase()

        switch (userInput) {
            case Options.Create:
                await this.taskList.createTask()
                break;
            case Options.Read:
                this.taskList.readTaskList()
                break;
            case Options.Update:
                await this.taskList.updateTaskStatus()
                break;
            case Options.Delete:
                await this.taskList.deleteTask()
                break;
            case Options.Exit:
                break;
            default:
                rl.write("Unknown action !\n")
                return this.choseOption()
        }

        this.displaySeparator()
        return userInput
    }

    async run(): Promise<void>
    {
        try {
            await this.loadTaskList()
        } catch (error) {
            rl.write(error.message)
            rl.close()
            return
        }

        rl.write("Welcome to your task manager !\n")
        this.displaySeparator()
        this.displayOptions()
        let userAction = await this.choseOption()

        while(userAction !== Options.Exit) {
            this.displayOptions()
            userAction = await this.choseOption()
        }

        await this.saveTaskList()
        rl.write("Exiting task manager...\n")
        rl.close()
    }
}
