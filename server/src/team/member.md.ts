import { Schema, mongoose, Model } from '../util/db'

let MemberSchema = new Schema({
  account: {
    type: String,
    maxlength: 20,
    required: true,
    unique: true
  },
  name: {
    type: String,
    maxlength: 20
  },
  password: {
    type: String,
    maxlength: 32,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  avatarUrl: String,
  email: String,
  openid: String,
  interfaceNotify: Boolean,
  testNotify: Boolean
})

let MemberModel = mongoose.model('member', MemberSchema)

enum role {
  user = 'user',
  admin = 'admin'
}

interface MemberInterface {
  id: string,
  account: string,
  name: string,
  password: string,
  role: role,
  avatarUrl: string,
  email: string,
  openid: string,
  interfaceNotify: boolean,
  testNotify: boolean
}

class Member extends Model {
  account: string = this.random()
  name: string = this.random()
  password: string = this.random()
  role: role = Math.random() > .5 ? role.admin : role.user
  avatarUrl?: string
  email?: string
  openid?: string
  interfaceNotify?: boolean
  testNotify?: boolean
}

export {
  MemberSchema,
  MemberModel,
  role,
  MemberInterface,
  Member
}
