import axios from 'axios'
import { MessageBox } from 'element-ui'
import Cache from './cache.ts'
import router from './router.ts'
import login from '../components/user/login'
export default {
  get: (url: string, config?: object) => new Promise(async(resolve, reject) => {
    axios.defaults.headers.common['Authorization'] = Cache.get('token') || ''
      let response = await axios.get(url, config)
      if (response.status === 200) {
        resolve(response.data)
      } else if (response.status === 401) {
        router.go('/user/login')
      } else if (response.status === 403) {
        // MessageBox.alert(e.message)
      } else {
        MessageBox.alert(response.status + ',' + response.statusText)
      }
  }),
  put: (url: string, data?: object, config?:object) => new Promise(async(resolve, reject) => {
    axios.defaults.headers.common['Authorization'] = Cache.get('token') || ''
      let resp = await axios.put(url, data, config)
      if (resp.status === 200) {
        resolve(resp.data)
      } else if (resp.status === 401) {
        MessageBox.alert('请先登录')
      } else {
        MessageBox.alert(resp.status + ',' + resp.statusText)
      }
    }),
    post: (url: string, data?: object, config?:object) => new Promise(async(resolve, reject) => {
      axios.defaults.headers.common['Authorization'] = Cache.get('token') || ''
      let resp = await axios.post(url, data, config)
      if (resp.status === 200) {
        resolve(resp.data)
      } else if (resp.status === 401) {
        MessageBox.alert('请先登录')
      } else {
        MessageBox.alert(resp.status + ',' + resp.statusText)
      }
  }),
  delete: (url: string, config?:object) => new Promise(async(resolve, reject) => {
    axios.defaults.headers.common['Authorization'] = Cache.get('token') || ''
      let resp = await axios.delete(url, config)
      if (resp.status === 200) {
        resolve(resp.data)
      } else if (resp.status === 401) {
        MessageBox.alert('请先登录')
      } else {
        MessageBox.alert(resp.status + ',' + resp.statusText)
      }
  })
}
