import { Status } from "./Status.js"

export type Task =
{
    id: number
    description: string
    status: Status
    created_at: Date
    updated_at: Date
    priority: number
}
