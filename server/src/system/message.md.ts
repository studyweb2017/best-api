import { Schema, mongoose } from '../util/db'

let MessageSchema = new Schema({
  interfaceId: String,
  content: String,
  timestamp: Number,
  readUserList: [String]
})

let MessageModel = mongoose.model('message', MessageSchema)

export = {
  MessageSchema,
  MessageModel
}