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

enum SystemInterval {
  hourly = 'hourly',
  daily = 'daily',
  monthly = 'monthly',
  weekly = 'weekly'
}

interface SystemInterface {
  coverUrl?: string,
  name?: string,
  backupSize?: number,
  autoTestEnabled?: boolean,
  autoTestInterval?: {
    interval: SystemInterval
    time: number
  }
}

export {
  SystemSchema,
  SystemModel,
  SystemInterface,
  SystemInterval
}
