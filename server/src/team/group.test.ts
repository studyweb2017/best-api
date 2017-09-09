import test from 'ava'
import { groupCtrl } from './group.ctrl'

let group: any = {
  name: Math.random().toString(36).substring(2, 8),
  memberList: ['59b38ee3cb9f170691e95806']
}

test.serial('group.post', (t:any) => {
  return groupCtrl.post(group)
    .do((res:any) => {
      group.id = res.id
      t.truthy(res)
    })
})

test.serial('group.get', (t: any) => {
  return groupCtrl.get()
  .do((res:any) => {
    t.truthy(res.list)
  })
})

test.serial('group.delete', (t:any) => {
  return groupCtrl.delete(group.id)
    .do((res:any) => {
      t.truthy(res)
    })
})