import { dbName, dbAddr, dbPort } from './config'
import * as mongoose from 'mongoose'

// 消除警告信息
mongoose.Promise = Promise
const connection =  mongoose.connect(`mongodb://${dbAddr}:${dbPort}/${dbName}`, {
  useMongoClient: true
})
const Schema = mongoose.Schema

export {
  mongoose,
  connection,
  Schema
}