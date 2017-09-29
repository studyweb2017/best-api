import { MemberModel, MemberInterface } from './member.md'
import { Observable } from 'rxjs/Rx'
import { encrypt } from '../util/crypto'
import { mongoose } from '../util/db'

export const memberCtrl = {
  get(isAdmin: boolean) {
    return Observable.of(isAdmin)
    .switchMap((authorized:boolean) => {
      if (authorized) {
        return Observable.fromPromise(MemberModel.aggregate().project({
          _id: 0,
          id: "$_id",
          isAdmin: 1,
          account: 1,
          name: 1
        }))
      } else {
        return Observable.throw({status: 403, message: '没有操作权限'})
      } 
    })
    .map((memberList: MemberInterface[]) => ({ memberList }))
  },
  post(member: any) {
    try {
      member.password = encrypt(member.password)
      return Observable.fromPromise(new MemberModel(member).save())
        .map((x: any) => ({ id: x._id }))
    } catch (e) {
      return Observable.throw(e)
    }
  },
  put(id: string, member: any) {
    try {
      if (member.password) member.password = encrypt(member.password)
      return Observable.fromPromise(MemberModel.update({ _id: mongoose.Types.ObjectId(id) }, member)
        .exec())
        .map((x: any) => ({ id: x._id }))
    } catch (e) {
      return Observable.throw(e)
    }
  },
  delete(_id: string) {
    return Observable.fromPromise(MemberModel.remove({ _id }).exec())
      .map((res: any) => ({ num: res.result.n }))
  }
}