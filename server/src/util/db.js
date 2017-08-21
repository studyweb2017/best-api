const { dbName, dbAddr, dbPort } = require('./config')
const mongoose = require('mongoose')

module.exports = {
  mongoose,
  connection: mongoose.connect(`mongodb://${dbAddr}:${dbPort}/${dbName}`),
  Schema: mongoose.Schema
}