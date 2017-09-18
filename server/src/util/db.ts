import { dbName, dbAddr, dbPort } from './config'
import * as mongoose from 'mongoose'

// 消除警告信息
mongoose.Promise = Promise

const connection = mongoose.connect(`mongodb://${dbAddr}:${dbPort}/${dbName}`, {
  useMongoClient: true
})

const Schema = mongoose.Schema

// 用于构造测试数据的基类
class Model {
  [key: string]: any
  random(x?: number): string {
    return Math.random().toString(36).substring(2, x || 10)
  }
  constructor(p?: any) {
    for (let k in p) {
      if (void 0 !== p[k]) this[k] = p[k]
    }
  }
}

export {
  mongoose,
  connection,
  Schema,
  Model
}