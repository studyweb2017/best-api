import axios from 'axios'
import { MessageBox } from 'element-ui'
import Cache from './cache'
import router from './router'

let request = (method: string, url: string, data: any, config: any = {}) => new Promise(async (resolve, reject) => {
  axios.defaults.headers.common['Authorization'] = Cache.get('token') || ''
  Object.assign(config, { method, url, data })
  try {
    let response = await axios(config)
    resolve(response.data)
  } catch (e) {
    reject(e.response.data)
    const { data, status, statusText } = e.response
    if (status === 401) {
      Cache.clear()
      router.push({ path: '/user/login' })
    } else if (status === 403) {
      MessageBox.alert(data)
    } else {
      MessageBox.alert(status + ',' + statusText)
    }
  }
})

export default {
  get: (url: string, config?: object) => request('GET', url, null, config),
  put: (url: string, data?: object, config?: object) => request('PUT', url, data, config),
  post: (url: string, data?: object, config?: object) => request('POST', url, data, config),
  delete: (url: string, data?: object, config?: object) => request('DELETE', url, data, config)
}
