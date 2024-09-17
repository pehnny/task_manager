const readline = require('readline');
const fs = require('fs')

const FILE = "tasklist.json"

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class Task {
    constructor(message) {
        this._message = message
        this._status = false
        this._BUFFER = message
    }

    get message() {
        return this._message
    }

    static from(obj) {
        let task = new Task("")
        task._message = obj._message
        task._status = obj._status
        task._BUFFER = obj._BUFFER
        return task
    }

    static isTask(obj) {
        if (typeof obj !== "object") {
            return false
        }

        if (Object.keys(obj).length !== 3) {
            return false
        }

        const EMPTY_TASK = new Task("")
        for (const KEY of Object.keys(obj)) {
            if (!Object.keys(EMPTY_TASK).includes(KEY)) {
                return false
            }
        }

        return true
    }

    changeStatus() {
        const STRIKE = "\u0336"
        this._status = !(this._status)

        if (this._status) {
            this._message = this._message.split("").map(char => STRIKE + char).join("")
        }
        else {
            this._message = this._message.split("").filter(char => char !== STRIKE).join("")
        }

        return this._BUFFER
    }
}

function tasksRead(taskList) {
    for (const [TASK_INDEX, TASK] of taskList.entries()) {
        console.log(`${TASK_INDEX+1}: ${TASK.message}`)
    }
}

async function taskCreate(taskList) {
    let userInput = await getUserInput("Your task: ")

    if (userInput) {
        let newTask = new Task(userInput)
        taskList.push(newTask)
        console.log(`Task "${userInput}" created !`)
    }
}

async function taskDelete(taskList) {
    tasksRead(taskList)
    let taskNumber = await getUserInput("Enter the number of the task you want to delete: ")
    
    if (isValidTaskNumber(taskNumber, taskList.length)) {
        taskNumber = Number(taskNumber)
        let removedTask = taskList.splice(taskNumber-1, 1)[0]
        console.log(`Task "${removedTask.message}" removed !`)
    }
}

async function taskUpdateStatus(taskList) {
    tasksRead(taskList)
    let taskNumber = await getUserInput("Enter the number of the task you want to (un)mark as completed: ")
    
    if (isValidTaskNumber(taskNumber, taskList.length)) {
        taskNumber = Number(taskNumber)
        let updatedTask = taskList[taskNumber-1].changeStatus()
        console.log(`Task "${updatedTask}" status updated !`)
    }
}

function getUserInput(prompt) {
    return new Promise(
        resolve => rl.question(
            prompt,
            userInput => resolve(userInput)
        )
    )
}

function isValidTaskNumber(input, max) {
    const MUST_BE_A_NUMBER = !/\D/.test(input)

    if (!MUST_BE_A_NUMBER) {
        console.log("Task number is not a number !")
        return false
    }

    const MUST_BE_IN_RANGE = (Number(input) >= 1) && (Number(input) <= max)

    if (!MUST_BE_IN_RANGE) {
        console.log("Task number is out of range !")
        return false
    }

    return true
}

async function askYesOrNo(message) {
    const YES = ["yes", "y", "oui"]
    const NO = ["no", "n", "non"]
    const YES_OR_NO = YES + NO
    let userInput = await getUserInput(message + " yes or no : ")
    while (!YES_OR_NO.includes(userInput.toLowerCase())) {
        userInput = await getUserInput("Wrong input ? yes or no: ")
    }
    return YES.includes(userInput)
}

async function loadTaskList() {
    let userInput = await askYesOrNo("Would you like to load your task list ?")

    if (!userInput) {
        return []
    }

    try {
        let taskList = JSON.parse(fs.readFileSync(FILE))
        taskList = taskList.filter(task => Task.isTask(task)).map(task => Task.from(task))
        console.log("Task list successfully retrieved !")
        return taskList
    } catch (error) {
        console.log("Unknow error detected !")
        console.log("Creating new task list... ")
        return []
    }
}

async function saveTaskList(taskList) {
    let userInput = await askYesOrNo("Would you like to save your task list ?")

    if (userInput) {    
        console.log("Saving task list...")
        const TASKLIST = JSON.stringify(taskList, null, 4)
        fs.writeFileSync(FILE, TASKLIST)
    }
}

async function main() {
    const CHOICES = "1. to see all your tasks\n"
        + "2. to add a task\n"
        + "3. to delete a task\n"
        + "4. to mark a task as done\n"
        + "5. to Exit the task manager"
    const SEPARATOR = Array.from(new Array(40), () => "-").join("")

    const TASKLIST = await loadTaskList()
    console.log(SEPARATOR)
    let userInput = ""
    
    console.log("Welcome to your task manager, Press: ")
    while(userInput !== "5") {
        console.log(CHOICES)
        console.log(SEPARATOR)

        userInput = await getUserInput("Your choice: ")
        console.log("")

        switch (userInput) {
            case "1":
                tasksRead(TASKLIST)
                await getUserInput("Enter to continue... ")
                break;
            case "2":
                await taskCreate(TASKLIST)
                break;
            case "3":
                await taskDelete(TASKLIST)
                break;
            case "4":
                await taskUpdateStatus(TASKLIST)
                break;
            case "5":
                break;
            default:
                console.log("Unvalid key !")
                break;
        }

        console.log(SEPARATOR)
    }

    await saveTaskList(TASKLIST)
    console.log("Exiting task manager...")
    rl.close()
}

main()
