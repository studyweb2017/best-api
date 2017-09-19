import * as crypto from 'crypto'
import { salt } from './config'

const cipher = crypto.createCipher('aes192', salt);

export const encrypt = (text: string) => {
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted
}