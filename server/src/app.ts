import * as fs from 'fs'
import * as Koa from 'koa'
import * as body from 'koa-better-body'
import { uploadPath as uploadDir } from './util/config'

import projectRouter from './project/router'
import interfaceRouter from './interface/router'
import memberRouter from './member/router'
import authRouter from './auth/router'
import systemRouter from './system/router'
import messageRouter from './message/router'
import mock from './mock/mock'
import authCtrl from './auth/AuthCtrl'
import SystemCtrl from './system/SystemCtrl'
// 系统初始化
let system = new SystemCtrl()
system.init()

const app = new Koa()
app.use(body({ uploadDir }))
app.use(authCtrl.authorize)
app.use(authRouter)
app.use(projectRouter)
app.use(interfaceRouter)
app.use(memberRouter)
app.use(systemRouter)
app.use(messageRouter)
app.use(mock)
app.use((ctx: any) => {
  ctx.body = 'api server'
})
app.listen(2018)

console.log('API server listening on 2018...')


