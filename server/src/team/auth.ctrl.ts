import { MemberModel } from './member.md'
import { Observable } from 'rxjs/Rx'
import { mongoose } from '../util/db'
import { encrypt, hash } from '../util/crypto'
import { SessionModel, SessionSchema } from './session.md'


export const authCtrl = {
  login(account: string, password: string, ctx: any) {
    return Observable.fromPromise(MemberModel.findOne({
      account,
      password: encrypt(password)
    }).select('_id name isAdmin avatarUrl'))
      .map((user: any) => {
        let result: any = {
          user: {
            id: user._id,
            name: user.name,
            isAdmin: user.isAdmin,
            avatar: user.avatarUrl
          }
        }
        if (!user) {
          result.errCode = 401
          result.errMsg = '用户名或密码错误'
        } else {
          result.errCode = 0
          result.errMsg = '登录成功'
          let sId = hash(Math.random().toString().substring(2))
          SessionModel.findOneAndUpdate({ _id: user._id }, {
            _id: user._id,
            session: sId
          }, { upsert: true }).exec()
          ctx.cookies.set('session', sId, {
            httpOnly: true,
            overwrite: true
          })
        }
        return result
      })
  },
  logout(ctx: any) {
    return Observable.fromPromise(SessionModel.findOneAndRemove({ session: ctx.cookies.get('session') }).exec())
  },
  authorize(ctx: any, next: any) {
    const whiteRoute = ['/api/user/login', '/api/user/signout']
    if (whiteRoute.includes(ctx.path)) {
      return next()
    } else {
      return SessionModel.findOne({
        session: ctx.cookies.get('session')
      }).then((doc: any) => {
        if (!doc) {
          ctx.status = 403
          ctx.body = '请登录'
        }
        return next()
      }, (e: any) => {
        ctx.body = e
        return next()
      })
    }
  }
}