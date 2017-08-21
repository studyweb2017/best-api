process.env.DEBUG = '*,-not_this';
const Koa = require('koa')
const app = new Koa()
const bodyParser = require('koa-body-parser')

const projectRouter = require('./router/project')

app.use(bodyParser())
app.use(projectRouter)

app.use(ctx => {
  ctx.body = 'api server'
})
app.listen(2018)

console.log('Listening on 2018...')