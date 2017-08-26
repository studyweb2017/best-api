import * as Koa from 'koa'
import * as bodyParser from 'koa-body-parser'

import projectRouter from './router/project'

const app = new Koa()
app.use(bodyParser())
app.use(projectRouter)

app.use((ctx:any) => {
  ctx.body = 'api server'
})
app.listen(2018)

console.log('Listening on 2018...')