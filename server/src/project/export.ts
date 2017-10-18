import { InterfaceModel } from '../interface/model'
import { mongoose } from '../util/db'
import { Observable } from 'rxjs/Rx'
import * as _ from 'lodash'
import * as fs from 'fs'
import * as path from 'path'
import Mock2json from '../mock/Mock2json'

const prefix = 'api'
const dist = 'report'
const src = 'template'
const title = 'API文档'

const getFile = (name: string) => {
  try {
    return fs.readFileSync(path.join(src, name)).toString()
  } catch (e) {
    console.error(e)
    return ''
  }
}

const setFile = (name: string, data: string) => {
  try {
    fs.existsSync(dist) ? void 0 : fs.mkdirSync(dist)
    return fs.writeFileSync(path.join(dist, name), data)
  } catch (e) {
    console.error(e)
    return e
  }
}

const exist = (name: string) => fs.existsSync(path.join('template', name))

const getIfc = (ifc: any) => {
  let obj: any = {
    name: ifc.name,
    method: ifc.method,
    desc: ifc.desc,
    url: ifc.url,
    requestParams: [],
    requestExample: '',
    responseParams: [],
    responseExample: '',
    exceptions: []
  }
  ifc.request.paramList.forEach((it: any) => {
    obj.requestParams.push({
      name: it.name,
      desc: it.description,
      type: it.type
    })
  })
  ifc.response.paramList.forEach((it: any) => {
    obj.requestParams.push({
      name: it.name,
      desc: it.description,
      type: it.type
    })
  })
  ifc.response.errList.forEach((it: any) => {
    obj.exceptions.push({
      param: it.mock,
      desc: it.remark
    })
  })
  if(ifc.request.paramList.length>0) {
    ifc.requestExample = Mock2json.makeMockJson(ifc.request.paramList, 'root')
  }
  if(ifc.response.paramList.length>0) {
    ifc.responseExample = Mock2json.makeMockJson(ifc.response.paramList, 'root')
  }
  return obj
}

export default {
  gen(pid: string) {
    let headTpl = getFile('default.head.html')
    let htmlTpl = getFile('default.html')
    let bodyTpl = exist('template.body.html') ? getFile('template.body.html') : getFile('default.body.html')
    let css = exist('template.css') ? getFile('template.css') : getFile('default.css')
    let head = _.template(headTpl)({ css: `${pid}.css`, title })
    return Observable.fromPromise(InterfaceModel.find({ pid: mongoose.Types.ObjectId(pid) }))
      .map((interfaceList: any) => {
        let str = ''
        interfaceList.forEach((ifc: any) => str += _.template(bodyTpl)(getIfc(ifc)))
        return str
      })
      .catch((e: any) => {
        console.error(e)
        return Observable.of(e)
      })
      .map((body: any) => {
        let html = _.template(htmlTpl)({ head, body })
        setFile(`${pid}.css`, css)
        setFile(`${pid}.html`, html)
        return path.join('/', prefix, dist, `${pid}.html`)
      })
  },
  readFile(filePath: string) {
    return Observable.of(fs.readFileSync(path.join(dist, filePath)))
  }
}