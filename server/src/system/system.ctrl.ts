import { Observable } from 'rxjs/Rx'
import * as fs from 'fs'
import { staticPath } from '../util/config'
import * as path from 'path'

export default class {
  static upload(files: any) {
    try {
      let file = files.pop()
      let name = path.join(staticPath, file.name.replace(/.*\/(.*)/ig, '$1'))
      fs.renameSync(file.path, name)
      let url = '/api/' + name 
      return Observable.of({ url })
    } catch(e) {
      return Observable.throw(e)
    }
  }
  static readFile(filePath: string) {
    return Observable.of(fs.readFileSync(path.join(staticPath, filePath)))
  }
}