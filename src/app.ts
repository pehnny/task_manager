import { TaskManager } from "./TaskManager.js";

const saveFile = "tasklist.json"

// function tasksRead(taskList) {
//     for (const [TASK_INDEX, TASK] of taskList.entries()) {
//         console.log(`${TASK_INDEX+1}: ${TASK.message}`)
//     }
// }

// async function taskCreate(taskList) {
//     let userInput = await getUserInput("Your task: ")

//     if (userInput) {
//         let newTask = new Task(userInput)
//         taskList.push(newTask)
//         console.log(`Task "${userInput}" created !`)
//     }
// }

// async function taskDelete(taskList) {
//     tasksRead(taskList)
//     let taskNumber = await getUserInput("Enter the number of the task you want to delete: ")
    
//     if (isValidTaskNumber(taskNumber, taskList.length)) {
//         taskNumber = Number(taskNumber)
//         let removedTask = taskList.splice(taskNumber-1, 1)[0]
//         console.log(`Task "${removedTask.message}" removed !`)
//     }
// }

// async function taskUpdateStatus(taskList) {
//     tasksRead(taskList)
//     let taskNumber = await getUserInput("Enter the number of the task you want to (un)mark as completed: ")
    
//     if (isValidTaskNumber(taskNumber, taskList.length)) {
//         taskNumber = Number(taskNumber)
//         let updatedTask = taskList[taskNumber-1].changeStatus()
//         console.log(`Task "${updatedTask}" status updated !`)
//     }
// }

// function isValidTaskNumber(input, max) {
//     const MUST_BE_A_NUMBER = !/\D/.test(input)

//     if (!MUST_BE_A_NUMBER) {
//         console.log("Task number is not a number !")
//         return false
//     }

//     const MUST_BE_IN_RANGE = (Number(input) >= 1) && (Number(input) <= max)

//     if (!MUST_BE_IN_RANGE) {
//         console.log("Task number is out of range !")
//         return false
//     }

//     return true
// }

// async function askYesOrNo(message) {
//     const YES = ["yes", "y", "oui"]
//     const NO = ["no", "n", "non"]
//     const YES_OR_NO = YES + NO
//     let userInput = await getUserInput(message + " yes or no : ")
//     while (!YES_OR_NO.includes(userInput.toLowerCase())) {
//         userInput = await getUserInput("Wrong input ? yes or no: ")
//     }
//     return YES.includes(userInput)
// }

// async function loadTaskList() {
//     let userInput = await askYesOrNo("Would you like to load your task list ?")

//     if (!userInput) {
//         return []
//     }

//     try {
//         let taskList = JSON.parse(readFileSync(saveFile))
//         taskList = taskList.filter(task => Task.isTask(task)).map(task => Task.from(task))
//         console.log("Task list successfully retrieved !")
//         return taskList
//     } catch (error) {
//         console.log("Unknow error detected !")
//         console.log("Creating new task list... ")
//         return []
//     }
// }

// async function saveTaskList(taskList) {
//     let userInput = await askYesOrNo("Would you like to save your task list ?")

//     if (userInput) {    
//         console.log("Saving task list...")
//         const TASKLIST = JSON.stringify(taskList, null, 4)
//         writeFileSync(saveFile, TASKLIST)
//     }
// }

async function main() {
    const taskManager = new TaskManager()
    await taskManager.run()
}

main()
