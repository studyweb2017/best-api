import { Schema, mongoose, Model } from '../util/db'
import { MemberSchema } from '../team/member.md'
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
        set: (v: any) => mongoose.Types.ObjectId(v)
      },
      name: String,
      role: {
        type: String,
        enum: ['guest', 'master', 'developer'],
      }
    }]
  }
})

enum role {
  guest = 'guest',
  master = 'master',
  developer = 'developer'
}

let ProjectModel = mongoose.model('project', ProjectSchema)

interface ProjectInterface {
  _id?: string,
  id: string,
  name: string,
  desc: string,
  testUrl: string
  memberList: string[],
  apiChangedInform: boolean,
  testFailedInform: boolean,
  openTest: boolean
}

class Project extends Model {
  name = this.random()
  desc = this.random(30)
}

export {
  ProjectSchema,
  ProjectModel,
  ProjectInterface,
  role,
  Project
}