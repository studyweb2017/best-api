import * as Router from 'koa-router'
import { Observable } from 'rxjs/Rx'
import { projectCtrl } from './project/project.ctrl'
import { interfaceCtrl } from './project/interface.ctrl'
import { memberCtrl } from './team/member.ctrl'
import { groupCtrl } from './team/group.ctrl'

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
  .do((res: any) => ctx.body = Object.assign({
    errCode: 0
  }, res))
  .toPromise()

router
// 项目
  .get('/project', (ctx:any) => handle(ctx, projectCtrl.get()))
  .get('/project/:id', (ctx:any) => handle(ctx, projectCtrl.getById(ctx.params.id)))
  .post('/project', (ctx:any) => handle(ctx, projectCtrl.post(ctx.request.body)))
  .put('/project/:id', (ctx:any) => handle(ctx, projectCtrl.put(ctx.params.id, ctx.request.body)))
  .del('/project/:id', (ctx:any) => handle(ctx, projectCtrl.delete(ctx.params.id)))
  // 接口
  .get('/project/:pid/api', (ctx:any) => handle(ctx, interfaceCtrl.get(ctx.params.pid)))
  .get('/project/:pid/api/:id', (ctx:any) => handle(ctx, interfaceCtrl.getById(ctx.params.pid, ctx.params.id)))
  .get('/project/:pid/api/:id/version', (ctx:any) => handle(ctx, interfaceCtrl.getVersionById(ctx.params.iid)))
  .post('/project/:pid', (ctx:any) => handle(ctx, interfaceCtrl.post(ctx.params.id, ctx.request.body)))
  .put('/project/:pid/api/:id', (ctx:any) => handle(ctx, interfaceCtrl.put(ctx.params.pid, ctx.params.id, ctx.request.body)))
  .del('/project/:pid/api/:id', (ctx:any) => handle(ctx, interfaceCtrl.delete(ctx.param.pid, ctx.params.id)))
// 成员
  .get('/group', (ctx:any) => handle(ctx, groupCtrl.get()))
  .get('/role', (ctx:any) => handle(ctx, groupCtrl.getRole()))
  .get('/member', (ctx:any) => handle(ctx, memberCtrl.get()))
  .post('/member', (ctx:any) => handle(ctx, memberCtrl.post(ctx.request.body)))
  .post('/user/login', (ctx:any) => handle(ctx, memberCtrl.login(ctx.request.body.user, ctx.request.body.password)))

export default router.routes()