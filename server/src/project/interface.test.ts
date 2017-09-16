// import test from 'ava'
// import { Observable } from 'rxjs/Rx'
// import { interfaceCtrl } from './interface.ctrl'
// import { projectCtrl } from './project.ctrl'
// import { memberCtrl } from '../team/member.ctrl'

// let random = (x?: number) => Math.random().toString(36).substring(2, x || 10)

// let project: any = {
//   name: random()
// }

// let member: any = {
//   account: random(),
//   name: random(),
//   password: random(6)
// }

// let ifc: any = {
//   name: random(),
//   version: '1.0',
//   url: '/api/test',
//   method: 'GET',
//   requestParams: [],
//   responseParams: []
// }

// test.before('Create project,member', (t: any) => {
//   return memberCtrl.post(member)
//     .switchMap((x: any) => {
//       member.id = x.id
//       ifc.editorId = x.id
//       ifc.creatorId = x.id
//       t.truthy(member.id)
//       project.memberList = [{
//         id: x.id,
//         role: 'master'
//       }]
//       return projectCtrl.post(project).do((x: any) => {
//         project.id = x.id
//         t.truthy(project.id)
//       })
//     })
// })

// test.after.always('Delete project.member', (t: any) => {
//   projectCtrl.delete(project.id).subscribe()
//   memberCtrl.delete(member.id).subscribe()
// })

// test.serial('interface.post', (t: any) => {
//   return interfaceCtrl.post(project.id, ifc)
//     .do((res: any) => {
//       t.truthy(res.id)
//     })
// })

// test.serial('interface.get', (t: any) => {
//   return interfaceCtrl.get(project.id)
//     .do((res: any) => {
//       t.truthy(res.apiList.length > 0)
//     })
// })

// // test.serial('interface.getVersionById', (t: any) => {
// //   return interfaceCtrl.getVersionById('pid', 'iid')
// //     .do((res: any) => {
// //       t.truthy(res)
// //     })
// // })

// test.serial('interface.delete', (t: any) => {
//   return interfaceCtrl.post(ifc.id, ifc)
//     .do((res: any) => {
//       t.truthy(res)
//     })
// })