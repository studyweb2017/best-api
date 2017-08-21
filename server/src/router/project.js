const Router = require('koa-router')
let router = new Router({
  prefix: '/api'
})

router.get('/projects', ctx => {
  console.log(ctx.body)
})

module.exports = router.routes()