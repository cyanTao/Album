const express = require('express')
const bodyParser = require('body-parser')
const colors = require('colors/safe')
const app = express()


const tools = require('./router/tools/index')

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)

// 设置静态资源文件夹为static
app.use(express.static('./source'))

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'content-type')
  res.header('Access-Control-Allow-Methods', 'POST,GET')
  if (req.method.toLowerCase() == 'options') res.send(200)
  else next()
})

app.use('/tools', tools)

app.listen('8080', () => {
  console.log(colors.yellow('\n服务开启在：http://127.0.0.1:8080'))
  console.log(colors.blue.underline('\n相册首页：http://localhost:8080/view/photos/'))
})