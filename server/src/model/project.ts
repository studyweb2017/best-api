import { Schema, mongoose } from '../util/db'
import { MemberSchema } from './member'
import { InterfaceSchema, InterfaceInterface } from './interface'
import { TestLogSchema, TestLogInterface } from './testLog'

let ProjectSchema = new Schema({
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
  interfaceList: {
    type: [InterfaceSchema],
    default: []
  },
  testList: {
    type: [TestLogSchema],
    default: []
  }
})

let ProjectModel = mongoose.model('project', ProjectSchema)

interface ProjectInterface {
  id?: string,
  name?: string,
  desc?: string,
  testUrl?: string
  memberList?: [string],
  interfaceList?: [InterfaceInterface],
  testList?: [TestLogInterface]
}

export {
  ProjectSchema,
  ProjectModel,
  ProjectInterface
}