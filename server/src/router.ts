import * as Router from 'koa-router'
import { Observable } from 'rxjs/Rx'
import { projectCtrl } from './project/project.ctrl'
import { interfaceCtrl } from './project/interface.ctrl'
import { memberCtrl } from './team/member.ctrl'
import { authCtrl } from './team/auth.ctrl'

let router = new Router({
  prefix: '/api'
})

const handle = (ctx: any, ob: Observable<any>): Promise<void> => ob.catch((e: any) => {
  ctx.body = {
    errCode: 110,
    errMsg: e.message || '操作失败'
  }
  console.error(e)
  return Observable.of()
})
  .do((res: any) => {
    console.log('session', ctx.user)
    ctx.body = Object.assign({
      errCode: 0
    }, res)
  })
  .toPromise()

const handleStatic = (ctx: any, ob: Observable<any>): Promise<void> => ob.catch((e: any) => {
  ctx.status = 404
  console.error(e)
  return Observable.of()
})
  .do((res: any) => {
    ctx.type = 'text/' + ctx.path.replace(/.*\.(html|css)$/, '$1')
    ctx.body = res
  })
  .toPromise()
router
  // 项目
  .get('/project', (ctx: any) => handle(ctx, projectCtrl.get()))
  .get('/project/:id', (ctx: any) => handle(ctx, projectCtrl.getById(ctx.params.id)))
  .post('/project', (ctx: any) => handle(ctx, projectCtrl.post(ctx.request.body)))
  .put('/project/:id', (ctx: any) => handle(ctx, projectCtrl.put(ctx.params.id, ctx.request.body)))
  .del('/project/:id', (ctx: any) => handle(ctx, projectCtrl.delete(ctx.params.id)))
  .get('/project/:id/doc', (ctx: any) => handle(ctx, projectCtrl.export(ctx.params.id)))
  .get('/report/:file', (ctx: any) => handleStatic(ctx, projectCtrl.report(ctx.params.file)))
  // 接口
  .get('/project/:pid/api', (ctx: any) => handle(ctx, interfaceCtrl.get(ctx.params.pid)))
  .get('/project/:pid/api/module', (ctx: any) => handle(ctx, interfaceCtrl.getModule(ctx.params.pid)))
  .get('/project/:pid/api/:id', (ctx: any) => handle(ctx, interfaceCtrl.getById(ctx.params.pid, ctx.params.id)))
  .get('/project/:pid/api/:id/version', (ctx: any) => handle(ctx, interfaceCtrl.getVersionById(ctx.params.id)))
  .post('/project/:pid/api', (ctx: any) => handle(ctx, interfaceCtrl.post(ctx.params.pid, ctx.request.body)))
  .put('/project/:pid/api/:id', (ctx: any) => handle(ctx, interfaceCtrl.put(ctx.params.pid, ctx.params.id, ctx.request.body)))
  .del('/project/:pid/api/:id', (ctx: any) => handle(ctx, interfaceCtrl.delete(ctx.params.pid, ctx.params.id)))
  .get('/role', (ctx: any) => handle(ctx, projectCtrl.getRole()))
  // 成员
  .get('/member', (ctx: any) => handle(ctx, memberCtrl.get()))
  .post('/member', (ctx: any) => handle(ctx, memberCtrl.post(ctx.request.body)))
  .put('/member/:id', (ctx: any) => handle(ctx, memberCtrl.put(ctx.params.id, ctx.request.body)))
  .del('/member/:id', (ctx: any) => handle(ctx, memberCtrl.delete(ctx.params.id)))
  .post('/user/login', (ctx: any) => handle(ctx, authCtrl.login(ctx.request.body.account, ctx.request.body.password, ctx)))
  .get('/user/logout', (ctx:any) => handle(ctx, authCtrl.logout(ctx)))

export default router.routes()