import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'

import router from './router'
import mock from './mock'
import { authCtrl } from './team/auth.ctrl'

const app = new Koa()
app.use(bodyParser())
app.use(authCtrl.authorize)
app.use(router)
app.use(mock)
app.use((ctx: any) => {
  ctx.body = 'api server'
})
app.listen(2018)

console.log('API server listening on 2018...')


