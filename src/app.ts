import { TaskManager } from "./TaskManager.js";

async function main() {
    const taskManager = new TaskManager()
    await taskManager.run()
}

await main()
