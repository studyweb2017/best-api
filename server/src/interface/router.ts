import Router from '../util/Router'
import Ctrl from './InterfaceCtrl'

let interfaceRouter = new Router()
let interfaceCtrl = new Ctrl()

export default interfaceRouter.router
  .get('/project/:pid/api', (ctx: any) => interfaceRouter.handle(ctx, interfaceCtrl.get(ctx.params.pid,ctx.user._id, ctx.user.isAdmin)))
  .get('/project/:pid/api/module', (ctx: any) => interfaceRouter.handle(ctx, interfaceCtrl.getModule(ctx.params.pid,ctx.user._id, ctx.user.isAdmin)))
  .get('/project/:pid/api/:id', (ctx: any) => interfaceRouter.handle(ctx, interfaceCtrl.getById(ctx.params.pid, ctx.params.id,ctx.user._id, ctx.user.isAdmin)))
  .get('/project/:pid/api/:id/version', (ctx: any) => interfaceRouter.handle(ctx, interfaceCtrl.getVersionById(ctx.params.pid, ctx.params.id,ctx.user._id, ctx.user.isAdmin)))
  .post('/project/:pid/api', (ctx: any) => interfaceRouter.handle(ctx, interfaceCtrl.post(ctx.params.pid, ctx.request.fields,ctx.user._id, ctx.user.isAdmin)))
  .put('/project/:pid/api/:id', (ctx: any) => interfaceRouter.handle(ctx, interfaceCtrl.put(ctx.params.pid, ctx.params.id, ctx.request.fields, ctx.user._id, ctx.user.isAdmin)))
  .del('/project/:pid/api/:id', (ctx: any) => interfaceRouter.handle(ctx, interfaceCtrl.delete(ctx.params.pid, ctx.params.id, ctx.user._id, ctx.user.isAdmin)))
.routes()