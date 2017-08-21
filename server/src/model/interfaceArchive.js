const { Schema, mongoose } = require('../util/db')
let { InterfaceSchema } = require('./interface')

let InterfaceLogModel = mongoose.model('interfaceLog', InterfaceSchema)
module.exports = {
  InterfaceSchema: InterfaceLogSchema,
  InterfaceLogModel
}