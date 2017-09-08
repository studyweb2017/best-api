import { Schema, mongoose } from '../util/db'
import { MemberSchema } from '../member/member.md'
import { InterfaceSchema, InterfaceInterface } from '../interface/interface.md'
import { TestSchema, TestInterface } from '../test/test.md'

let ProjectSchema = new Schema({
  id: String,
  name: {
    type: String,
    maxlength: 20,
    required: true
  },
  desc: {
    type: String,
    maxlength: 200,
    alias: 'description'
  },
  testUrl: {
    type: String,
    maxlength: 200,
    alias: 'testAddress'
  },
  apiChangedInform: Boolean,
  testFailedInform: Boolean,
  openTest: Boolean,
  memberList: {
    alias: 'members',
    type: [{
      _id: false,
      id: String,
      name: String,
      role: {
        type: String,
        enum: ['guest', 'master', 'developer'],
      }
    }]
  },
  interfaceList: {
    type: [InterfaceSchema],
    default: []
  }
})

let ProjectModel = mongoose.model('project', ProjectSchema)

interface ProjectInterface {
  _id?: string,
  id?: string,
  name?: string,
  desc?: string,
  testUrl?: string
  memberList?: string[],
  interfaceList?: InterfaceInterface[],
  apiChangedInform: boolean,
  testFailedInform: boolean,
  openTest: boolean
}

export {
  ProjectSchema,
  ProjectModel,
  ProjectInterface
}