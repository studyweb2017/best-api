import * as Router from 'koa-router'
import { Context } from './interface'
import { Observable } from 'rxjs/Rx'
import { projectCtrl, projectGet, projectPost } from './controller/project'
import { memberCtrl } from './controller/member'

let router = new Router({
  prefix: '/api'
})

const handle = (ctx: Context, ob: Observable<any>): Promise<void> => ob.catch((e: any) => {
  ctx.body = {
    errCode: 110,
    errMsg: e.message || '操作失败'
  }
  console.error(e)
  return Observable.of()
})
  .do((res: any) => ctx.body = Object.assign({
    errCode: 0
  }, res))
  .toPromise()

interface Context4projectPost extends Context {
  body: projectPost
}

router
  .get('/project', (ctx: Context) => handle(ctx, projectCtrl.get()))
  .get('/project/:id', (ctx: Context) => handle(ctx, projectCtrl.getById(ctx.params.id)))
  .post('/project', (ctx: Context4projectPost) => handle(ctx, projectCtrl.post(ctx.request.body)))
  .put('/project/:id', (ctx: Context) => handle(ctx, projectCtrl.put(ctx.request.body)))
  .del('/project/:id', (ctx: Context) => handle(ctx, projectCtrl.del(ctx.params.id)))
  .get('/member', (ctx: Context) => handle(ctx, memberCtrl.get()))
  .post('/member', (ctx: Context) => handle(ctx, memberCtrl.post(ctx.request.body)))
  .post('/user/login', (ctx: Context) => handle(ctx, memberCtrl.login(ctx.request.body.user, ctx.request.body.password)))

export default router.routes()