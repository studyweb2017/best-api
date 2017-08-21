const dbAddr = process.env.DB_HOST || 'api-db'
const dbPort = process.env.DB_PORT || 27017
const dbName = 'api'

module.exports = {
  dbAddr,
  dbPort,
  dbName
}