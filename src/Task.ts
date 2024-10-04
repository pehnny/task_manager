import { Status } from "./Status.js"

type TTask =
{
    message: string
    status: Status
    buffer: string
}

export class Task implements TTask
{
    message: string
    status: Status // TODO reimplement with enum Status
    buffer: string

    constructor(message: string)
    {
        this.message = message
        this.status = Status.Ongoing
        this.buffer = message
    }

    static from(task: TTask): Task
    {
        let newtask = new Task("")
        newtask.message = task.message
        newtask.status = task.status
        newtask.buffer = task.buffer
        return newtask
    }

    // TODO reimplement with enum Status
    updateStatus(): string
    {
        const strike = "\u0336"
        switch (this.status) {
            case Status.Ongoing:
                this.status = Status.Done
                this.message = this.message.split("").map(char => strike + char).join("")
                break;
            case Status.Done:
                this.status = Status.Ongoing
                this.message = this.message.split("").filter(char => char !== strike).join("")
                break;
        }

        return this.buffer
    }
}
