import * as Koa from 'koa'
import * as bodyParser from 'koa-body-parser'

import router from './router'

const app = new Koa()
app.use(bodyParser())
app.use(router)

app.use((ctx:any) => {
  ctx.body = 'api server'
})
app.listen(2018)

console.log('Listening on 2018...')