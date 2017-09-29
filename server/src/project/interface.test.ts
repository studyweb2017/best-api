import test from 'ava'
import { Observable } from 'rxjs/Rx'
import InterfaceCtrl from './Interface.ctrl'
import { Interface } from './interface.md'
import ProjectCtrl from './Project.ctrl'
import { Project } from './project.md'
import { memberCtrl } from '../team/member.ctrl'
import { Member } from '../team/member.md'

let project = new Project()
let member = new Member()
let ifc = new Interface()

test.before('Create project,member', (t: any) => {
  return memberCtrl.post(member)
    .switchMap((x: any) => {
      member.id = x.id
      ifc.editorId = x.id
      ifc.creatorId = x.id
      t.truthy(member.id)
      project.memberList = [{
        id: x.id,
        role: 'master'
      }]
      return ProjectCtrl.post(project).do((x: any) => {
        project.id = x.id
        t.truthy(project.id)
      })
    })
})

// test.after('Delete project.member', (t: any) => {
//   ProjectCtrl.delete(project.id).subscribe()
//   memberCtrl.delete(member.id).subscribe()
// })

// test.serial('interface.post', (t: any) => {
//   return interfaceCtrl.post(project.id, ifc)
//     .do((res: any) => {
//       ifc.id = res.id
//       t.truthy(res.id)
//     })
// })

// test.serial('interface.get', (t: any) => {
//   return interfaceCtrl.get(project.id)
//     .do((res: any) => {
//       t.truthy(res.apiList.length > 0)
//     })
// })

// test.serial('interface.getVersionById', (t: any) => {
//   return interfaceCtrl.getVersionById(ifc.id)
//     .do((res: any) => {
//       t.truthy(res.versionList)
//     })
// })

// test.serial('interface.put', (t:any) => {
//   return interfaceCtrl.put(project.id, ifc.id, {name: 'nihao'})
//     .do((res: any) => {
//       t.truthy(res)
//     })
// })

// test.serial('interface.getHistoryById', (t: any) => {
//   return interfaceCtrl.getHistoryById(ifc.id, ifc.version)
//     .do((res: any) => {
//       t.deepEqual(res.name, ifc.name)
//     })
// })

// test.serial('interface.delete', (t: any) => {
//   return interfaceCtrl.delete(project.id, ifc.id)
//     .do((res: any) => {
//       t.truthy(res)
//     })
// })