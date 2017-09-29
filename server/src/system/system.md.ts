import { Schema, mongoose } from '../util/db'

let SystemSchema = new Schema({
  logoUrl: String,
  companyName: String,
  backupSize: Number,
  autoTestEnabled: Boolean,
  autoTestInterval: {
    interval: {
      type: String,
      enum: ['hourly', 'daily', 'monthly', 'weekly']
    },
    time: Number
  },
  dingInformUrl: String,
  dingInformOperation: {
    type: String,
    enum: ["addInterface", "editInterface", "deleteInterface", "autoTestInterface"]
  },
  towerInformUrl: String,
  towerInformOperation: {
    type: String,
    enum: ["addInterface", "editInterface", "deleteInterface", "autoTestInterface"]
  }
})

let SystemModel = mongoose.model('system', SystemSchema)

enum SystemInterval {
  hourly = 'hourly',
  daily = 'daily',
  monthly = 'monthly',
  weekly = 'weekly'
}

enum SystemInformOperation {
  addInterface = "addInterface", 
  editInterface = "editInterface", 
  deleteInterface = "deleteInterface", 
  autoTestInterface = "autoTestInterface"
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
  SystemInterval,
  SystemInformOperation
}
