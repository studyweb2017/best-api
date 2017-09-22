import * as crypto from 'crypto'
import { salt } from './config'


export const encrypt = (text: string='') => {
  let cipher = crypto.createCipher('aes192', salt)
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted
}

export const hash = (text: string) => crypto.createHash('md5').update(text).digest('base64')
