import {env} from 'process'

export const dbAddr = env.DB_HOST || 'api-db'
export const dbPort = env.DB_PORT || 27017
export const dbName = 'api'
export const salt = 'Api is good for developers'