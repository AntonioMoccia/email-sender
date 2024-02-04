import mongoose, {Model, Schema, SchemaType} from 'mongoose'
import { Service } from '../../types'
const Mixed = Schema.Types.Mixed



const servicesSchema = new Schema<Service>({

    id_service: Schema.Types.UUID,
    email:String,
    provider: String,
    authParams: Mixed
})

const model = mongoose.model<Service>('Services',servicesSchema)
export default model