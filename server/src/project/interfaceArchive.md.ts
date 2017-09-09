import { Schema, mongoose } from '../util/db'
import { InterfaceSchema, InterfaceInterface } from './interface.md'

const InterfaceLogSchema = InterfaceSchema.clone()
InterfaceLogSchema.iid = {
  type: String
}
InterfaceLogSchema.pid = {
  type: String
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