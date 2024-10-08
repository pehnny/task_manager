import { rl } from "./global.js";
import { TaskManager } from "./TaskManager.js";

async function main(): Promise<void>
{
    const taskManager = new TaskManager()
    await taskManager.run()
    rl.close()
}

main()
