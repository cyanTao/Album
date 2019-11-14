const express = require('express')
const bodyParser = require('body-parser')
const qs = require('querystring')
const fs = require('fs')
const app = express()
const router = express.Router()

const tools = require('./router/tools/index')

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)

// 设置静态资源文件夹为static
app.use(express.static('./source'))

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'content-type')
  res.header('Access-Control-Allow-Methods', 'POST,GET')
  if (req.method.toLowerCase() == 'options') res.send(200)
  else next()
})

app.use('/tools', tools)

app.listen('8080', () => {
  console.log('http://127.0.0.1:8080')
})
