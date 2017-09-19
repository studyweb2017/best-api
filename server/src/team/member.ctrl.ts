import { MemberModel, MemberInterface } from './member.md'
import { Observable } from 'rxjs/Rx'
import { encrypt } from '../util/crypto'

export const memberCtrl = {
  getMap() {
    let map: any = {}
    return Observable.zip(Observable.fromPromise(MemberModel.find({}))
      .switchMap((list: any) => Observable.from(list))
      .map((x: any) => ({ [x._id]: x }))
      .toArray(), (arg: any) => Object.assign.apply(null, arg))
  },
  get() {
    return Observable.fromPromise(MemberModel.aggregate().project({
      "id": "$_id",
      "isAdmin": 1,
      "account": 1,
      "name": 1
    }))
      .map((list: MemberInterface[]) => ({ list }))
  },
  post(member: any) {
    member.password = encrypt(member.password)
    return Observable.fromPromise(new MemberModel(member).save())
      .map((x: any) => ({ id: x._id }))
  },
  delete(_id: string) {
    return Observable.fromPromise(MemberModel.remove({ _id }).exec())
      .map((res: any) => ({ num: res.result.n }))
  },
  login(account: string, password: string) {
    return Observable.fromPromise(MemberModel.findOne({
      account,
      password
    }))
      .map((res: MemberInterface | undefined) => {
        let result = {}
        if (res) {
          result = {
            user: {
              name: res.account,
              role: res.role,
              avatar: ''
            }
          }
        } else {
          result = {
            code: -1,
            message: '用户名或密码错误'
          }
        }
        return result
      })
  }
}