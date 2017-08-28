import * as Router from 'koa-router'
import { Context } from './interface'
import projectCtrl from './controller/project'
import userCtrl from './controller/user'

const router = new Router({
  prefix: '/api'
})

router.get('/project', async (ctx: Context) => {
  try {
    ctx.body = {
      list: await projectCtrl.get()
    }
  } catch (e) {
    ctx.body = {
      errCode: -1,
      errMessage: e.toString()
    }
  }
}).post('/project', async (ctx: Context) => {
  try {
    ctx.body = {
      id: await projectCtrl.post(ctx.body)
    }
  } catch (e) {
    ctx.body = {
      errCode: -1,
      errMessage: e.toString()
    }
  }
}).put('/project/:id', async (ctx: Context) => {

}).del('/project/:id', async (ctx: Context) => {
  try {
    ctx.body = await projectCtrl.remove(ctx.query.id)
  } catch (e) {
    ctx.body = {
      errCode: -1,
      errMessage: e.toString()
    }
  }
}).post('/login', (ctx: Context) => {
  userCtrl.login(ctx.body.account, ctx.body.password)
})

export default router.routes()