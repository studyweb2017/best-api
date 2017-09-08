import { Schema, mongoose } from '../util/db' 

const TestSchema = new Schema({
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

interface TestInterface {
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

const TestModel = mongoose.model('Test', TestSchema)

export {
  TestSchema,
  TestModel,
  TestInterface
}