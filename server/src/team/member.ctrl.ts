import { MemberModel, MemberInterface } from './member.md'
import { Observable } from 'rxjs/Rx'
import { encrypt } from '../util/crypto'

export const memberCtrl = {
  get() {
    return Observable.fromPromise(MemberModel.aggregate().project({
      _id: 0,
      id: "$_id",
      isAdmin: 1,
      account: 1,
      name: 1
    }))
      .map((memberList: MemberInterface[]) => ({ memberList }))
  },
  post(member: any) {
    try {
      member.password = encrypt(member.password)
      return Observable.fromPromise(new MemberModel(member).save())
        .map((x: any) => ({ id: x._id })) 
    } catch(e) {
      return Observable.throw(e)
    }
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