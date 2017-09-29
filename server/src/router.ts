import * as Router from 'koa-router'
import { Observable } from 'rxjs/Rx'
import projectCtrl from './project/project.ctrl'
import InterfaceCtrl from './project/Interface.ctrl'
import { memberCtrl } from './team/member.ctrl'
import { authCtrl } from './team/auth.ctrl'
import systemCtrl from './system/system.ctrl'
import { staticPath } from './util/config'

let router = new Router({
  prefix: '/api'
})

export default router
  .param('pid', (id: string, ctx: any, next: any) => {
    if (!/\w{24}/.test(id)) {
      return ctx.throw(404, '项目id格式不正确')
    } else {
      return next()
    }
  })
  .param('id', (id: string, ctx: any, next: any) => {
    if (!/\w{24}/.test(id)) {
      return ctx.throw(404, 'id格式不正确')
    } else {
      return next()
    }
  })
  // 项目
  .get('/project', (ctx: any) => handle(ctx, projectCtrl.get(ctx.user._id, ctx.user.isAdmin)))
  .get('/project/:id', (ctx: any) => handle(ctx, projectCtrl.getById(ctx.params.id, ctx.user._id, ctx.user.isAdmin)))
  .post('/project', (ctx: any) => handle(ctx, projectCtrl.post(ctx.request.fields)))
  .put('/project/:id', (ctx: any) => handle(ctx, projectCtrl.put(ctx.params.id, ctx.request.fields, ctx.user._id, ctx.user.isAdmin)))
  .del('/project/:id', (ctx: any) => handle(ctx, projectCtrl.delete(ctx.params.id, ctx.user._id, ctx.user.isAdmin)))
  .get('/project/:id/doc', (ctx: any) => handle(ctx, projectCtrl.export(ctx.params.id, ctx.user._id, ctx.user.isAdmin)))
  .get('/report/:file', (ctx: any) => handleStatic(ctx, projectCtrl.report(ctx.params.file)))
  // 接口
  .get('/project/:pid/api', (ctx: any) => handle(ctx, InterfaceCtrl.get(ctx.params.pid)))
  .get('/project/:pid/api/module', (ctx: any) => handle(ctx, InterfaceCtrl.getModule(ctx.params.pid)))
  .get('/project/:pid/api/:id', (ctx: any) => handle(ctx, InterfaceCtrl.getById(ctx.params.pid, ctx.params.id)))
  .get('/project/:pid/api/:id/version', (ctx: any) => handle(ctx, InterfaceCtrl.getVersionById(ctx.params.id)))
  .post('/project/:pid/api', (ctx: any) => handle(ctx, InterfaceCtrl.post(ctx.params.pid, ctx.request.fields)))
  .put('/project/:pid/api/:id', (ctx: any) => handle(ctx, InterfaceCtrl.put(ctx.params.pid, ctx.params.id, ctx.request.fields)))
  .del('/project/:pid/api/:id', (ctx: any) => handle(ctx, InterfaceCtrl.delete(ctx.params.pid, ctx.params.id)))
  .get('/role', (ctx: any) => handle(ctx, projectCtrl.getRole()))
  // 成员
  .get('/member', (ctx: any) => handle(ctx, memberCtrl.get(ctx.user.isAdmin)))
  .post('/member', (ctx: any) => handle(ctx, memberCtrl.post(ctx.request.fields)))
  .put('/member/:id', (ctx: any) => handle(ctx, memberCtrl.put(ctx.params.id, ctx.request.fields)))
  .del('/member/:id', (ctx: any) => handle(ctx, memberCtrl.delete(ctx.params.id)))
  .post('/user/login', (ctx: any) => handle(ctx, authCtrl.login(ctx.request.fields.account, ctx.request.fields.password)))
  .get('/user/logout', (ctx: any) => handle(ctx, authCtrl.logout(ctx.user._id)))
  // 系统
  .post('/setting/upload/img', (ctx: any) => handle(ctx, systemCtrl.upload(ctx.request.files)))
  .get(`/${staticPath}/:file`, (ctx: any) => handleStatic(ctx, systemCtrl.readFile(ctx.params.file)))
  .routes()

const handle = (ctx: any, ob: Observable<any>): Promise<void> => ob.catch((e: any) => {
  console.error(e)
  if (e.status) {
    ctx.throw(e.status, e.message|| '操作失败')
  } else {
    ctx.body = {
      errCode: 110,
      errMsg: e.message || '操作失败'
    }
  }
  return Observable.of()
})
  .do((res: any) => {
    ctx.body = Object.assign({erroCode: 0}, res)
  })
  .toPromise()

const handleStatic = (ctx: any, ob: Observable<any>): Promise<void> => ob.catch((e: any) => {
  console.error(e)
  ctx.throw(404, '未找到资源')
  return Observable.of()
})
  .do((res: any) => {
    if (/(\.png|\.jpg|\.jpeg)$/.test(ctx.path)) {
      ctx.type = 'image/' + ctx.path.replace(/.*\.(.*)$/, '$1')
    } else {
      ctx.type = 'text/' + ctx.path.replace(/.*\.(html|css)$/, '$1')
    }
    ctx.body = res
  })
  .toPromise()
