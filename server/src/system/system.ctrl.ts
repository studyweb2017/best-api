import { Observable } from 'rxjs/Rx'
import * as fs from 'fs'
import { staticPath } from '../util/config'
import * as path from 'path'

export default class {
  static upload(files: any, isAdmin: boolean=false) {
    try {
      if(isAdmin) {
        let file = files.pop()
        let name = path.join(staticPath, file.name.replace(/.*\/(.*)/ig, '$1'))
        fs.renameSync(file.path, name)
        let imgUrl = '/api/' + name 
        return Observable.of({ imgUrl })
      } else {
        return Observable.throw({status:403, message:'没有上传权限'})
      }
    } catch (e) {
      return Observable.throw(e)
    }
  }
  static readFile(filePath: string) {
    return Observable.of(fs.readFileSync(path.join(staticPath, filePath)))
  }
}