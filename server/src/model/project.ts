import { Schema, mongoose } from '../util/db'
import { MemberSchema } from './member'
import { InterfaceSchema } from './interface'

let ProjectSchema = new Schema({
  id: {
    type: String,
    maxlength: 8,
    required: true
  },
  name: {
    type: String,
    maxlength: 20,
    required: true
  },
  desc: {
    type: String,
    maxlength: 200
  },
  testUrl: {
    type: String,
    maxlength: 200
  },
  memberList: [String],
  interfaceList: [InterfaceSchema]
})

let ProjectModel = mongoose.model('project', ProjectSchema)

export {
  ProjectSchema,
  ProjectModel
}