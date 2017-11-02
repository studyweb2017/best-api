import Router from '../util/Router'
import Ctrl from './MessageCtrl'

let router = new Router()
let ctrl= new Ctrl()

export default router.router
  .get('/message', (ctx: any) => router.handle(ctx, ctrl.get(ctx.user._id)))
  .put('/message/:id', (ctx: any) => router.handle(ctx, ctrl.put(ctx.user._id, [ctx.params.id])))
.routes()