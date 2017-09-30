import Router from '../util/Router'
import Ctrl from './Ctrl'

let memberRouter = new Router()
let memberCtrl = new Ctrl()

export default memberRouter.router
  .get('/member', (ctx: any) => memberRouter.handle(ctx, memberCtrl.get(ctx.user.isAdmin)))
  .post('/member', (ctx: any) => memberRouter.handle(ctx, memberCtrl.post(ctx.request.fields)))
  .put('/member/:id', (ctx: any) => memberRouter.handle(ctx, memberCtrl.put(ctx.params.id, ctx.request.fields)))
  .del('/member/:id', (ctx: any) => memberRouter.handle(ctx, memberCtrl.delete(ctx.params.id)))
  .routes()