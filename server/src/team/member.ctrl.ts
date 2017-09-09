import { MemberModel, MemberInterface } from './member.md'
import { Observable } from 'rxjs/Rx'


export const memberCtrl = {
  getMap() {
    let map: any = {}
    return Observable.zip(Observable.fromPromise(MemberModel.find({}))
      .switchMap((list: any) => Observable.from(list))
      .map((x: any) => ({[x._id]: x}))
      .toArray(), (arg) => Object.assign.apply(null, arg))
  },
  get() {
    return Observable.fromPromise(MemberModel.aggregate({$project:{
      "id": "$_id",
      "isAdmin": 1,
      "account": 1,
      "name": 1
    }}))
      .map((list: MemberInterface[]) => ({ list }))
  },
  post(member: any) {
    return Observable.fromPromise(new MemberModel(member).save())
  },
  delete(id: string) {
    return Observable.fromPromise(MemberModel.remove({ _id: id }))
      .map((res: any) => { 
        if(res.result.n) {
          return {num: res.result.n }
        } else {
          throw `删除成员${id}失败`
        }
      })
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