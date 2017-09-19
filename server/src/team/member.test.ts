import test from 'ava'
import { memberCtrl } from './member.ctrl'
import { Member } from './member.md'

let member = new Member()

test.serial('memeber.post', (t: any) => {
  return memberCtrl.post(member).do((res: any) => t.truthy(res.id))
})

test.serial('member.get', (t: any) => {
  return memberCtrl.get()
    .do((res: any) => {
      member.id = res.list.filter((x: any) => member.account === x.account)[0].id
    })
    .do((res: any) => t.truthy(res.list.length > 0))
})

test.serial('member.getMap', (t: any) => {
  return memberCtrl.getMap()
    .do((res:any) => {
      t.truthy(res[member.id])
    })
})

test.serial('member.delete', (t: any) => {
  return memberCtrl.delete(member.id)
    .do((res: any) => t.deepEqual(res.num, 1))
})