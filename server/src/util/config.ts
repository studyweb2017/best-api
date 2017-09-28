import { env } from 'process'
import * as path from 'path'
import * as fs from 'fs'
import * as crypto from 'crypto'

export const dbAddr = env.DB_HOST || 'api-db'
export const dbPort = env.DB_PORT || 27017
export const dbName = 'api'
export const uploadPath = 'upload'
export const staticPath = 'static'

export let key = ''

try {
  if (!fs.existsSync('key')) {
    key = Math.random().toString(32).substring(2)
    fs.writeFileSync('key', key)
  } else {
    key = fs.readFileSync('key').toString()
  }
} catch (e) {
  console.error('初始化系统文件失败', e)
}

[uploadPath, staticPath].forEach((path: string) => {
  try {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path)
    }
  } catch (e) {
    console.error('创建目录%s失败，可能导致系统无法正常使用', path, e)
  }
})