import * as Router from 'koa-router'
import { Context } from '../interface'

const router = new Router({
  prefix: '/api'
})

router.get('/projects', (ctx: Context) => {
  console.log(ctx.body)
})

export default router.routes()