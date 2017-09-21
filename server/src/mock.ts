import * as path2reg from 'path-to-regexp'
import { InterfaceModel, Interface } from './project/interface.md'
import { Observable } from 'rxjs/Rx'
import { mongoose } from './util/db'

export default (ctx: any, next: any) => {
  let { method, path, query, headers, body } = ctx.request
  let _path = path.replace('/', '').split('/')
  let pid = _path.shift()
  path = '/' + _path.join('/')
  if(/\w{24}/.test(pid)) {
    return Observable.fromPromise(InterfaceModel.find({ pid: mongoose.Types.ObjectId(pid), method }))
      .switchMap((res: Interface[]) => Observable.from(res))
      .combineLatest(Observable.of({ path, query, body, headers }))
      .throttleTime(500)
      .map(([ifc, { path, query, body, headers }]) => {
        let re = path2reg(ifc.url)
        let match = re.exec(path)
        if (match) {
          ctx.body = match
        } else {
          next()
        }
      })
      .toPromise() 
  } else {
    return next()
  }
}