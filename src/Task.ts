type TTask =
{
    message: string
    status: boolean
    buffer: string
}

export class Task implements TTask
{
    message: string
    status: boolean // TODO reimplement with enum Status
    buffer: string

    constructor(message: string)
    {
        this.message = message
        this.status = false
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
        this.status = !(this.status)

        if (this.status) {
            this.message = this.message.split("").map(char => strike + char).join("")
        }
        else {
            this.message = this.message.split("").filter(char => char !== strike).join("")
        }

        return this.buffer
    }
}