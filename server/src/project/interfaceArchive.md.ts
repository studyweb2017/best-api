import { Schema, mongoose } from '../util/db'
import { InterfaceSchemaObj, InterfaceInterface } from './interface.md'

let InterfaceLogSchemaObj:any = Object.assign(InterfaceSchemaObj, {
  iid: Schema.Types.ObjectId,
  url: {
    type: String,
    match: /^\//,
    required: true
  },
  version: String
})

delete InterfaceLogSchemaObj.needTest

const InterfaceLogSchema = new Schema(InterfaceLogSchemaObj)

const InterfaceLogModel = mongoose.model('interfaceLog', InterfaceLogSchema)

interface InterfaceLogInterface extends InterfaceInterface{
  iid: string
}

export {
  InterfaceLogSchema,
  InterfaceLogModel,
  InterfaceLogInterface
}