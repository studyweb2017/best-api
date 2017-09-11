import { Schema, mongoose } from '../util/db'
import { InterfaceSchema, InterfaceInterface } from './interface.md'

const InterfaceLogSchema = InterfaceSchema.clone()
InterfaceLogSchema.iid = {
  type: Schema.Types.ObjectId
}
InterfaceLogSchema.pid = {
  type: Schema.Types.ObjectId
}

const InterfaceLogModel = mongoose.model('interfaceLog', InterfaceLogSchema)

interface InterfaceLogInterface extends InterfaceInterface{
  iid: string,
  pid: string
}

export {
  InterfaceLogSchema,
  InterfaceLogModel,
  InterfaceLogInterface
}