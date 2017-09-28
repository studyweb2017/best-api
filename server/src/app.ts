import * as fs from 'fs'
import * as Koa from 'koa'
import * as body from 'koa-better-body'
import { uploadPath as uploadDir } from './util/config'

import router from './router'
import mock from './mock'
import { authCtrl } from './team/auth.ctrl'

const app = new Koa()


app.use(body({ uploadDir }))
app.use(authCtrl.authorize)
app.use(router)
app.use(mock)
app.use((ctx: any) => {
  ctx.body = 'api server'
})
app.listen(2018)

console.log('API server listening on 2018...')


