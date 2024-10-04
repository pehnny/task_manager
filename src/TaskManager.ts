import { sep } from "path";
import { rl } from "./GUI.js";
import { Options } from "./Options.js";
import { TaskList } from "./TaskList.js"
import { readFileSync, writeFileSync } from "fs";

export class TaskManager
{
    taskList: TaskList

    private async askYesOrNo(message: string): Promise<string>
    {
        const question = message + " yes or no ? "
        let userInput = await rl.question(question)
        userInput = userInput.trim().toLowerCase()

        if (!["yes", "no"].includes(userInput)) {
            return this.askYesOrNo(message)
        }

        return userInput
    }

    private displayOptions(): void
    {
        const options = "1. to Create a new task\n"
        + "2. to Read your task list\n"
        + "3. to Update the status of a task\n"
        + "4. to Selete a task\n"
        + "5. to Exit the task manager\n"

        rl.write(options)
    }

    private displaySeparator(): void
    {
        const separator = Array.from(new Array(40), () => "-").join("")
        rl.write(separator + "\n")
    }

    private loadTaskList(): void
    {
        // TODO load tasklist
        // this.taskList = loadedTaskList
    }

    private saveTaskList(): void
    {
        // TODO save tasklist
    }

    private async choseOption(): Promise<Options>
    {
        this.displayOptions()
        this.displaySeparator()

        const userInput = await rl.question("Chose an action number from the list above")
        const userInputParser = parseInt(userInput)

        switch (userInputParser) {
            case Options.Create:
                this.taskList.createTask()
                return Options.Create
            case Options.Read:
                this.taskList.readTaskList()
                return Options.Read
            case Options.Update:
                this.taskList.updateTask()
                return Options.Update
            case Options.Delete:
                this.taskList.deleteTask()
                return Options.Delete
            case Options.Exit:
                return Options.Exit
            default:
                return this.choseOption()
        }
    }

    async run(): Promise<void>
    {
        // TODO menu asking for user what to do
        const CHOICES = "1. to see all your tasks\n"
        + "2. to add a task\n"
        + "3. to delete a task\n"
        + "4. to mark a task as done\n"
        + "5. to Exit the task manager"
    const SEPARATOR = Array.from(new Array(40), () => "-").join("")

    const TASKLIST = await this.loadTaskList()
    console.log(SEPARATOR)
    let userInput = ""
    
    console.log("Welcome to your task manager, Press: ")
    while(userInput !== "5") {
        console.log(CHOICES)
        console.log(SEPARATOR)

        userInput = await rl.question("Your choice: ")
        console.log("")
        // TODO reimplement with enum Options
        switch (userInput) {
            case "1":
                await this.taskList.createTask()
                break;
            case "2":
                await this.taskList.readTaskList()
                break;
            case "3":
                await this.taskList.updateTask()
                break;
            case "4":
                await this.taskList.deleteTask()
                break;
            case "5":
                break;
            default:
                console.log("Unvalid key !")
                break;
        }

        console.log(SEPARATOR)
    }

    await this.saveTaskList()
    console.log("Exiting task manager...")
    rl.close()
    }
}
