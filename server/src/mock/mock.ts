import * as path2reg from 'path-to-regexp'
import { InterfaceModel, Interface } from '../interface/model'
import { Observable } from 'rxjs/Rx'
import { mongoose } from '../util/db'
import Probability from './probability'
import Mock2json from './Mock2json'

export default (ctx: any, next: any) => {
  let { method, path, query, headers, body } = ctx.request
  let _path = path.replace('/', '').split('/')
  let pid = _path.shift()
  path = '/' + _path.join('/')
  if (/\w{24}/.test(pid)) {
    return Observable.fromPromise(InterfaceModel.find({ pid: mongoose.Types.ObjectId(pid), method }))
      .switchMap((res: Interface[]) => Observable.from(res))
      .combineLatest(Observable.of({ path, query, body, headers }))
      .throttleTime(500)
      .map(([ifc, { path, query, body, headers }]) => {
        var keys: any = []
        let re = path2reg(ifc.url, keys, { strict: true })
        let match = re.exec(path)
        if (match) {
          // 地址栏参数对象
          let query = ctx.query
          // 请求体对象
          let payload = ctx.request.fields
          // 占位符参数
          let param: any = {}
          keys.forEach((key: any, index: number) => {
            param[key.name] = match[index + 1]
          })
          let paramValid: any = []
          // 校验占位符和地址栏参数
          ifc.request.urlParams.forEach((it: any) => {
            if (it.required) {
              if (!param[it.name] && !query[it.name]) {
                paramValid.push(`缺少URL参数'${it.name}'`)
              }
            }
          })
          // 校验请求体
          let bodyTemplate = Mock2json.makeMockJson(ifc.request.paramList || [], 'root')
          let bodyValid = []
          let errorMsg: any = []
          bodyValid = Mock2json.valid(bodyTemplate, ctx.request.fields || {})
          errorMsg = paramValid.concat(bodyValid)
          if (errorMsg.length) {
            ctx.body = {
              errorCode: 400,
              errorMsg
            }
          } else {
            return new Promise((resolve, rejct) => {
              setTimeout(() => {
                ifc.response.headerList.forEach((it: any) => {
                  ctx.set(it.key, it.value)
                })
                if (ifc.errList.length) {
                  let list:any = []
                  ifc.exceptionList.forEach((item: any) => {
                    if (item.enabled) {
                      let response
                      try {
                        response = eval(item.data)
                      } catch (e) {
                        console.error(e)
                        response = item.data
                      }
                      list.push({
                        p: item.probability + '%',
                        fn: () => ctx.body = item.response
                      })
                    }
                  })
                  let p = new Probability(list)
                  p.roll()
                } else {
                  ctx.body = Mock2json.makeJson(ifc.response.paramList, 'root')
                }
                resolve()
              }, ifc.delay)
            })
          }
        } else {
          next()
        }
      })
      .toPromise()
  } else {
    return next()
  }
}