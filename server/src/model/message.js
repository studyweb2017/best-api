const { Schema, mongoose } = require('../util/db')

let MessageSchema = new Schema({
  interfaceId: String,
  content: String,
  timestamp: Number,
  readUserList: [String]
})

let MessageModel = mongoose.model('message', MessageSchema)

module.exports = {
  MessageSchema,
  MessageModel
}