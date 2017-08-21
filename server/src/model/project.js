const { Schema, mongoose } = require('../util/db')
const { MemberSchema } = require('./member')
const { InterfaceSchema } = require('./interface')

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

module.exports = {
  ProjectSchema,
  ProjectModel: mongoose.model('project', ProjectSchema)
}