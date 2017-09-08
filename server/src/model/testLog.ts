import { Schema, mongoose } from '../util/db' 

const TestLogSchema = new Schema({
  pid: String,
  startTime: Date,
  endTime: Date,
  totalTime: Number,
  operatorId: String,
  totalTest: Number,
  successTest: Number,
  result: String,
  errorLog: String
})

interface TestLogInterface {
  pid: string,
  startTime?: Date,
  endTime?: Date,
  totalTime?: number,
  operatorId?: string,
  totalTest?: number,
  successTest?: number,
  result?: string,
  errorLog?: string
}

const TestLogModel = mongoose.model('testLog', TestLogSchema)

export {
  TestLogSchema,
  TestLogModel,
  TestLogInterface
}