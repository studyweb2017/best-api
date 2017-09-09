import { Schema, mongoose } from '../util/db'

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
    maxlength: 16,
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
  _id?: string,
  id: string,
  account?: string,
  nickName?: string,
  password?: string,
  role?: role,
  avatarUrl?: string,
  email?: string,
  openid?: string,
  interfaceNotify?: boolean,
  testNotify?: boolean
}

export {
  MemberSchema,
  MemberModel,
  role,
  MemberInterface
}