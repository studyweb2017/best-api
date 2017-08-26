import { Schema, mongoose } from '../util/db'
import { InterfaceSchema as InterfaceLogSchema } from './interface'

let InterfaceLogModel = mongoose.model('interfaceLog', InterfaceLogSchema)

export {
  InterfaceLogSchema,
  InterfaceLogModel
}