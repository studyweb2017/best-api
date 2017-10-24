let gId:Function = (size?: number) => {
  let t = (new Date()).getTime()
  let p = (Math.random().toString(16) + '00000000').substr(2,8)
  return   t + '-' + p.substr(0, size ? size : 4)
}
let gVersion:Function = () => {
  let t = new Date()
  let r = Math.random()
  let y = t.getFullYear()
  let m = t.getMonth() + 1
  let d = t.getDate()
  let h = t.getHours()
  let mi = t.getMinutes()
  let s = t.getSeconds()
  return y + '' +  (m < 10 ? '0' : '') + m + (d < 10 ? '0' : '') + d + '' + '.' + (h < 10 ? '0' : '') + h + (mi < 10 ? '0' : '') + mi + (s < 10 ? '0' : '') + s + '.' + (Math.random().toString(16) + '00000000').substr(2,4)
}
import {Tree} from '../service/interface.ts'
function formatApiToTree (apiList:any[]): Tree[] {
    let modules:any = []
    let urls:any = []
    apiList.forEach((api:any) => {
      let moduleIndex:any = modules.findIndex((m:any) => { return api.module === m.name })
      if (moduleIndex === -1) {
        modules.push({
          label: 'module',
          name: api.module,
          id: gId(),
          children: [{
<<<<<<< HEAD
            label:'url',
            api: api,
            name: api.name,
            id: api.id
          },{
=======
>>>>>>> 9e54e799de70785989a55f16c855fd983e7c2deb
            label: 'newUrl',
            name: '',
            module: api.module,
            id: gId()
<<<<<<< HEAD
=======
          },
          {
            label:'url',
            api: api,
            name: api.name,
            id: api.id
>>>>>>> 9e54e799de70785989a55f16c855fd983e7c2deb
          }]
        })
      } else {
        urls = modules[moduleIndex].children
<<<<<<< HEAD
        urls.unshift({
=======
        urls.push({
>>>>>>> 9e54e799de70785989a55f16c855fd983e7c2deb
          label: 'url',
          name: api.name,
          id: api.id,
          api: api
        })
      }
    })
    return modules
}

export {
  gId,
  gVersion,
  formatApiToTree
}
