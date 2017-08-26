import { dbName, dbAddr, dbPort } from './config'
import mongoose from 'mongoose'

const connection =  mongoose.connect(`mongodb://${dbAddr}:${dbPort}/${dbName}`)
const Schema = mongoose.Schema

export {
  mongoose,
  connection,
  Schema
}