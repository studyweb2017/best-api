import { MemberModel, MemberInterface } from '../model/member'
import { Observable } from 'rxjs/Rx'

export const memberCtrl = {
  get() {
    return Observable.fromPromise(MemberModel.find({}, { _id: 1, isAdmin: 1, account: 1, name: 1 }))
      .switchMap((x: any) => Observable.from(x))
      .map((x: any) => ({
        id: x._id,
        isAdmin: x.isAdmin,
        account: x.account,
        name: x.name
      }))
      .toArray()
      .map((list: MemberInterface[]) => ({ list }))
  },
  post(member: any) {
    return Observable.fromPromise(new MemberModel({
      account: member.name,
      password: member.pswd
    }).save())
  },
  del(id: string) {
    return Observable.fromPromise(MemberModel.remove({ _id: id }))
      .map(() => ({ num: 1 }))
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