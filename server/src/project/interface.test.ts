import test from 'ava'
import { Observable } from 'rxjs/Rx'
import { interfaceCtrl } from './interface.ctrl'
import { projectCtrl } from './project.ctrl'


let project:any = {
  name: Math.random().toString(36).substring(2, 10),
  members: []
}

let ifc:any = {
  name: Math.random().toString(36).substring(2, 10),
  url: '/api/',
  method: 'get',
  requestParams: [],
  responseParams: []
}
test((t:any) => t.pass())

// test.serial('interface.post', (t: any) => {
//   return projectCtrl.post(project)
//     .do(() => projectCtrl.get().subscribe((list:any) => {
//       project._id= list.filter((x:any) => x.name === project.name)[0]._id
//       ifc.pid = project._id
//     }))
//     .do(() => interfaceCtrl.post(ifc))
//     .do((res: any) => {
//       t.truthy(res)
//     })
// })

// test.serial('interface.getVersionById', (t: any) => {
//   return interfaceCtrl.getVersionById('pid', 'iid')
//     .do((res: any) => {
//       t.truthy(res)
//     })
// })
