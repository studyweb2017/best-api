/**
 * 无页面测试服务端API
 */
import BaseCtrl from '../util/BaseCtrl'
import * as axios from 'axios'

export default class AgentCtrl extends BaseCtrl{
  forward(url: string, method: string='GET', data: any={}, headers: any={}) {
    let request:any = {
      data,
      method,
      headers
    }
    if(/^http/.test(url)) {
      request.url = url
    } else {
      request.url = 'http://'+url
    }
    return this.from(axios(request))
      .map((result:any) => {
        return {
          data: result.data,
          status: result.status,
          statusText: result.statusText,
          headers: result.headers
        }
      })
  }
}