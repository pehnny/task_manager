import { Model } from "sequelize"
import { Status } from "./Status.js"

export class Task extends Model
{
    declare id: number
    declare description: string
    declare status: Status
    declare created_at: Date
    declare updated_at: Date
    declare priority: number
}
