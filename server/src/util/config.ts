import {env} from 'process'
import * as path from 'path'
import * as fs from 'fs'

export const dbAddr = env.DB_HOST || 'api-db'
export const dbPort = env.DB_PORT || 27017
export const dbName = 'api'

export let salt = ''

if(!fs.existsSync('salt')) {
  salt = Math.random().toString(32).substring(2)
  fs.writeFileSync('salt', salt)
} else {
  salt = fs.readFileSync('salt').toString()
}
