import test from 'ava'
import { memberCtrl } from './member'

let member: any = {
  name: Math.random().toString(36).substring(2, 8),
  pswd: 'test'
}

test.serial('memeber.post', (t: any) => {
  return memberCtrl.post(member).do((res: any) => t.deepEqual(res.account, member.name))
})

test.serial('member.get', (t: any) => {
  return memberCtrl.get()
    .do((res: any) => member._id = res.list.filter((x: any) => member.name === x.account)[0]._id)
    .do((res:any) => t.truthy(res.list.length > 0))
})

test.serial('member.delete', (t: any) => {
  return memberCtrl.del(member._id)
    .do((res: any) => t.deepEqual(res.num, 1))
})