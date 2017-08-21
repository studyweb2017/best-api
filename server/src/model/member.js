const { Schema, mongoose } = require('../util/db')

let MemberSchema = new Schema({
  account: {
    type: String,
    maxlength: 20,
    required: true,
    unique: true
  },
  password: {
    type: String,
    maxlength: 16,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  avatarUrl: String,
  email: String,
  openid: String,
  interfaceNotify: Boolean,
  testNotify: Boolean
})

let MemberModel = mongoose.model('member', MemberSchema)
module.exports = {
  MemberSchema,
  MemberModel
}