const { Schema, mongoose } = require('../util/db')

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

module.exports = {
  SystemSchema,
  SystemModel
}
