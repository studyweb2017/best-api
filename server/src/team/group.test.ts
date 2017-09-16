import test from 'ava'
import { groupCtrl } from './group.ctrl'
import { Group } from './group.md'
import { Member } from './member.md'
import { memberCtrl } from './member.ctrl'
import { Observable } from 'rxjs/Rx'

let group = new Group()
let member = new Member()
let ready: any

test.before('create Member', (t: any) => {
  return memberCtrl.post(member)
    .do((res: any) => {
      t.truthy(res.id)
      group.memberList = [res.id]
    })
})

test.serial('group.getRole', (t: any) => {
  return groupCtrl.getRole()
    .do((res: any) => {
      t.truthy(res.roleList.length > 0)
    })
})

test.serial('group.post', (t: any) => {
  return groupCtrl.post(group)
    .do((res: any) => {
      group.id = res.id
      t.truthy(res.id)
    })
})


test.serial('group.get', (t: any) => {
  return groupCtrl.get()
    .do((res: any) => {
      t.truthy(res.groups.length > 0)
      let g = res.groups.filter((x: any) => x.id == group.id)[0]
      t.truthy(g.members.length === 1)
    })
})

test.serial('group.put', (t: any) => {
  group.name = 'test4api'
  group.memberList = []
  return groupCtrl.put(group)
    .switchMap((res: any) => groupCtrl.get().do((rest: any) => {
      let newGroup = rest.groups.filter((x: any) => x.id == group.id)[0]
      t.truthy(newGroup.members.length === 0)
    }))
})

test.serial('group.delete', (t: any) => {
  return groupCtrl.delete(group.id)
    .do((res: any) => {
      t.truthy(res)
    })
})

test('group.post.error', (t:any) => {
  return groupCtrl.post({})
    .catch((e:any) => {
      t.truthy(e)
      return Observable.of()
    })
})

test('group.put.error', (t:any) => {
  return groupCtrl.put({})
    .catch((e:any) => {
      t.truthy(e)
      return Observable.of()
    })
})