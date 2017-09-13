import { Schema, mongoose } from '../util/db'
import { MemberSchema } from '../team/member.md'
import { InterfaceSchema, InterfaceInterface } from './interface.md'
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
  apiChangedInform: {
    type: Boolean,
    default: false
  },
  testFailedInform: {
    type: Boolean,
    default: false
  },
  openTest: {
    type: Boolean,
    default: false
  },
  memberList: {
    type: [{
      _id: false,
      id: {
        type: Schema.Types.ObjectId,
        set: (v:any) => Schema.ObjectId(v)
      },
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
  _id?: any,
  id?: string,
  name?: string,
  desc?: string,
  testUrl?: string
  memberList?: string[],
  interfaceList?: InterfaceInterface[],
  apiChangedInform?: boolean,
  testFailedInform?: boolean,
  openTest: boolean
}

export {
  ProjectSchema,
  ProjectModel,
  ProjectInterface
}