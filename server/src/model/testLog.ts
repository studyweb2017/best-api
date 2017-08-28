import { Schema, mongoose } from '../util/db' 

let TestLogSchema = new Schema({
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
  startTime?: Date,
  endTime?: Date,
  totalTime?: number,
  operatorId?: string,
  totalTest?: number,
  successTest?: number,
  result?: string,
  errorLog?: string
}

export {
  TestLogSchema,
  TestLogInterface
}