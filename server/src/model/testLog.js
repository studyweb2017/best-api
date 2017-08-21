const { Schema, mongoose } = require('../util/db')

let TestLogSchema = new Schema({
  projectName: String,
  startTime: new Date,
  endTime: new Date,
  totalTime: Number,
  operatorId: String,
  result: String,
  errorLog: String
})

let TestLogModel = mongoose.model('testLog', TestLogSchema)

module.exports = {
  TestLogSchema,
  TestLogModel
}