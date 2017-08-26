import { Schema, mongoose } from '../util/db'

let SystemSchema = new Schema({
  coverUrl: String,
  name: String,
  backupSize: Number,
  autoTestEnabled: Boolean,
  autoTestInterval: {
    interval: {
      type: String,
      enum: ['hourly', 'daily', 'monthly', 'weekly']
    },
    time: Number
  }
})

let SystemModel = mongoose.model('system', SystemSchema)

export {
  SystemSchema,
  SystemModel
}
