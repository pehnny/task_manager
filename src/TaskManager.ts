import { rl } from "./GUI.js";
import { TaskList } from "./TaskList.js"
import { readFileSync, writeFileSync } from "fs";

export class TaskManager
{
    taskList: TaskList

    private isValidOption(option: Option): boolean
    {
        // TODO check user input with enum Option
    }

    private askYesOrNo(): string
    {
        // TODO ask user for yes or no and returns answer
    }

    private displayOptions(): void
    {
        // TODO display menu options
    }

    private endDisplay(): void
    {
        // TODO display separator
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
