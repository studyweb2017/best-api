import test from 'ava'
import { Observable } from 'rxjs/Rx'
import { projectCtrl } from './project.ctrl'
import { Project, role } from './project.md'
import { Member } from '../team/member.md'
import { memberCtrl } from '../team/member.ctrl'
import { Interface } from './interface.md'
import { Test } from '../test/test.md'


let member = new Member()
let project = new Project()

test.before('create member,project', (t: any) => {
  return memberCtrl.post(member)
    .do((res: any) => {
      member.id = res.id
      t.truthy(res.id)
      project.members = [{
        role: role.master,
        id: res.id
      }]
    })
})

test.serial('project.post', (t: any) => {
  return projectCtrl.post(project).do((res: any) => {
    project.id = res.id
    t.truthy(res.id)
  })
})

test.serial('project.put', (t: any) => {
  return projectCtrl.put(project.id, {
    name: 'hello',
    members: [{
      id: member.id,
      role: role.guest
    }]
  })
    .do((res: any) => {
      t.truthy(res.num)
    })
})

test.serial('project.getById', (t: any) => {
  return projectCtrl.getById(project.id).do((res: any) => {
    t.deepEqual('hello', res.name)
    t.deepEqual(res.members[0].role, role.guest)
  })
})

test('project.put.error', (t: any) => {
  t.plan(1)
  return projectCtrl.put('', {
    name: '111'
  }).catch((res: any) => {
    t.truthy(res)
    return Observable.of()
  }).switchMap(() => t.pass())
})

test('project.post.error', (t: any) => {
  t.plan(1)
  return projectCtrl.post({}).catch((res: any) => {
    t.truthy(res)
    return Observable.of()
  }).switchMap(() => t.pass())
})

test.serial('project.get', (t: any) => {
  return projectCtrl.get(member.id, member.isAdmin).do((res: any) => {
    t.truthy(res.list.length > 0)
  })
})

test.serial('project.delete', (t: any) => {
  return projectCtrl.delete(project.id).do((res: any) => t.deepEqual(res.num, 1))
})