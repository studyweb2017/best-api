import { MemberModel } from './member.md'
import { Observable } from 'rxjs/Rx'
import { mongoose } from '../util/db'
import { encrypt } from '../util/crypto'

export const authCtrl = {
  login(account: string, password: string) {
    return Observable.fromPromise(MemberModel.findOne({
      account,
      password: encrypt(password)
    }))
      .map((res: any) => {
        let result = {
          errCode: 0,
          errMsg: '登录成功'
        }
        if (!res) {
          result.errCode = 401
          result.errMsg = '用户名或密码错误'
        } else {

        }
        return result
      })
  },
  authorize(ctx: any, next: any) {
    next()
  }
}