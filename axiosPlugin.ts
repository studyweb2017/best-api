import axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui'
import router from './router.ts'

const Axios:any = axios.create({
  baseURL: '',
  timeout: 10000,
  responseType: 'json',
  withCredentials: true,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
  }
})
Axios.interceptors.request.use(
  (config:any) => {
    let m:any = config.method
    if (m === 'post' || m === 'put' || m === 'delete') {
      config.data = qs.stringify(config.data)
    }
    if (localStorage.token) {
      config.headers.Authorization = localStorage.token
    }
    return config
  },(error:any) => {
    Message({type: 'error', message: error.data.error.message})
    return Promise.reject(error.data.error.message)
  }
)
Axios.interceptors.response.use(
  (resp:any) => {
    if (resp.data && !resp.data.errCode) {
      Message({type: 'error', message: resp.data.errMsg || '操作失败'})
      return Promise.reject(resp.data.errMsg)
    }
    return resp
  },
  (error:any) => {
    if (!localStorage.getItem('token')) {
      router.push('/user/login')
    } else {
      // let lifeTime:any = JSON.parse(localStorage.getItem)
    }
    if (error.response.status === 403) {
      Message({type: 'error', message: '当前登录信息失效， 请重新登录'})
      router.push('/user/login')
    } else if (error.response.status === 404) {
      router.push('/error/404')
    }
    return Promise.reject(error.data.errMsg)
  }
)

export default {
  install: (Vue:any, Option:any) => {
    Object.defineProperty(Vue.prototype, '$http', { value: Axios})
  }
}
