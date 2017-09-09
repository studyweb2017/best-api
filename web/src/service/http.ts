import axios from 'axios'
import { MessageBox } from 'element-ui'
export default {
  get: (url: string, config?: object) => new Promise(async(resolve, reject) => {
    try {
      let response = await axios.get(url, config)
      resolve(response.data)
    } catch(e) {
      MessageBox.alert(e.message)
      reject(e)
    }
  }),
  put: (url: string, data?: object, config?:object) => new Promise(async(resolve, reject) => {
    try {
      let resp = await axios.put(url, data, config)
      resolve(resp)
    } catch(e) {
      MessageBox.alert(e.message)
      reject(e)
    }
  }),
  post: (url: string, data?: object, config?:object) => new Promise(async(resolve, reject) => {
    try {
      let resp = await axios.post(url, data, config)
      resolve(resp)
    } catch(e) {
      reject(e)
      MessageBox.alert(e.message)
    }
  }),
  delete: (url: string, config?:object) => new Promise(async(resolve, reject) => {
    try {
      let resp = await axios.delete(url, config)
      resolve(resp)
    } catch(e) {
      MessageBox.alert(e.message)
      reject(e)
    }
  })
}
