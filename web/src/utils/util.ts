let gId:Function = (size?: number) => {
  let t = (new Date()).getTime()
  let p = (Math.random().toString(16) + '00000000').substr(2,8)
  return   t + '-' + p.substr(0, size ? size : 4)
}
import {Tree} from '../service/interface.ts'
function formatApiToTree (apiList:any[]): Tree[] {
    let modules:any = []
    let urls:any = []
    let methods:any = []
    apiList.forEach((api:any) => {
      let moduleIndex:any = modules.findIndex((m:any) => { return api.module === m.name })
      if (moduleIndex === -1) {
        modules.push({
          label: 'module',
          name: api.module,
          childrenId: [api.id],
          children: [{
            label:'url',
            name: api.url,
            childrenId: [api.id],
            children: [{
              label: 'method',
              name: api.method,
              id: api.id,
              childrenId: [api.id],
              version: api.version,
              isTest: api.isTest
            }]
          }]
        })
      } else {
        modules[moduleIndex].childrenId.push(api.id)
        urls = modules[moduleIndex].children
        let urlIndex:any = urls.findIndex((url:any) => { return api.url === url.name })
        if (urlIndex === -1) {
          urls.push({
            label: 'url',
            name: api.url,
            childrenId: [api.id],
            children: [{
              label: 'method',
              name: api.method,
              id: api.id,
              childrenId: [api.id],
              version: api.version,
              isTest: api.isTest }] })
        } else {
          urls[urlIndex].childrenId.push(api.id)
          methods = urls[urlIndex].children
          methods.push({ label: 'method', name: api.method, id: api.id, childrenId: api.id, version: api.version, isTest: api.isTest })
        }
      }
    })
    return modules
}

export {
  gId,
  formatApiToTree
}
