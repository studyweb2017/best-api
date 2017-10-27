import Router from '../util/Router'
import Ctrl from './AgentCtrl'

let agentRouter = new Router()
let agentCtrl = new Ctrl()

export default agentRouter.router
  .post('/agent', (ctx: any) => agentRouter.handleProxy(ctx, agentCtrl.forward(ctx.request.fields.url, ctx.request.fields.method, ctx.request.fields.data, ctx.request.fields.headers)))
.routes()