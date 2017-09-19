import { Schema, mongoose } from '../util/db'
import { InterfaceSchema, InterfaceInterface } from './interface.md'

const InterfaceLogSchema = InterfaceSchema.clone()

InterfaceLogSchema.iid = {
  type: Schema.Types.ObjectId
}

delete InterfaceLogSchema.needTest

const InterfaceLogModel = mongoose.model('interfaceLog', InterfaceLogSchema)

interface InterfaceLogInterface extends InterfaceInterface{
  iid: string
}

export {
  InterfaceLogSchema,
  InterfaceLogModel,
  InterfaceLogInterface
}