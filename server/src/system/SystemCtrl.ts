import { Observable } from 'rxjs/Rx'
import * as fs from 'fs'
import { staticPath } from '../util/config'
import * as path from 'path'
import BaseCtrl from '../util/BaseCtrl'
import { SystemModel } from './model'

export default class SystemCtrl extends BaseCtrl {
  constructor() {
    super()
    Observable.from(SystemModel.find().exec())
      .subscribe((list: any) => {
        if (!list.length) {
          new SystemModel().save(() => {
            console.log('初始化系统配置成功')
          }, (e: any) => {
            console.error('初始化系统配置失败：', e)
          })
        }
      })
  }
  get() {
    return Observable.fromPromise(SystemModel.findOne().exec())
      .map((doc:any) => {
        let reportStyle
        let reportTemplate
        const templatePath = 'template'
        let cssPath = path.join(templatePath, 'template.css')
        let htmlPath = path.join(templatePath, 'template.html')
        if(!fs.existsSync(cssPath)) {
          cssPath = path.join(templatePath, 'default.css')
        }
        if(!fs.existsSync(htmlPath)) {
          htmlPath = path.join(templatePath, 'default.body.html')
        }
        reportStyle = fs.readFileSync(cssPath).toString()
        reportTemplate = fs.readFileSync(htmlPath).toString()
        return Object.assign({
          reportStyle,
          reportTemplate
        }, doc._doc)
      })
  }
  put(configInfo:any, isAdmin:boolean) {
    if(isAdmin) {
      try {
        fs.writeFileSync(path.join('template', 'template.css'), configInfo.reportStyle)
        fs.writeFileSync(path.join('template', 'template.body.html'), configInfo.reportTemplate) 
        return Observable.from(SystemModel.update(configInfo).exec()) 
      } catch(e) {
        return Observable.throw(e)
      }
    } else {
      return Observable.throw({
        errorCode: '403',
        errorMsg: '没有操作权限'
      })
    }
  }
  upload(files: any, isAdmin: boolean = false) {
    try {
      if (isAdmin) {
        let file = files.pop()
        let name = path.join(staticPath, file.name.replace(/.*\/(.*)/ig, '$1'))
        fs.renameSync(file.path, name)
        let imgUrl = '/api/' + name
        return Observable.of({ imgUrl })
      } else {
        return Observable.throw({ status: 403, message: '没有上传权限' })
      }
    } catch (e) {
      return Observable.throw(e)
    }
  }
  readFile(filePath: string) {
    return Observable.of(fs.readFileSync(path.join(staticPath, filePath)))
  }
}