const express = require('express')
const router = express.Router()
const fs = require('fs')
const upload = require('./upload.js')

// 相册文件夹链接
const albumPath = './source/data/static/album'
// 返回给前端的静态资源链接
const staticPath = '/data/static/album/'

// 获取文件夹
router.post('/pictures', (req, res) => {
  fs.readdir(albumPath, function (err, files) {
    if (err) {
      console.log('error:' + err)
      return
    }
    res.send({
      pictures: files
    })
  })
})

// 获取文件夹相册及第一张图片
router.post('/detail', (req, res) => {
  var name = req.query.name
  fs.readdir(`${albumPath}/` + name, function (err, files) {
    if (err) {
      console.log('error:' + err)
      return
    };
    (async () => {
      const result = []
      for (let i = 0; i < files.length; i++) {
        let item = await getInfo(
          `${albumPath}/` + name + '/' + files[i]
        )
        result.push({
          name: files[i],
          ctime: item.ctime,
          type: item.type || false,
          url: item.url || false,
          cover: item.cover
        })
      }
      let orderResult = result.sort(function (a, b) {
        let result = b.ctime - a.ctime
        return result
      })
      const newArr = []
      orderResult.forEach(item => {
        let obj = {
          name: item.name,
          type: item.type || 'dir',
          src: staticPath + name + '/' + item.name + '/' + item.cover,
          url: item.url || '',
          ctime: item.ctime
        }
        newArr.push(obj)
      })
      res.send({
        pictures: newArr
      })
    })()
  })
})

// 获取相册里面图片
router.post('/photo', (req, res) => {
  var name = req.query.name
  var target = req.query.target
  fs.readdir(`${albumPath}/` + name + '/' + target, function (
    err,
    files
  ) {
    if (err) {
      console.log('error:' + err)
      return
    }
    var newArr = []
    files.forEach(item => {
      newArr.push(staticPath + name + '/' + target + '/' + item)
    })
    res.send({
      pictures: newArr
    })
  })
})

// 上传
router.post('/upload',upload)


function getInfo(name) {
  return new Promise(resolve => {
    fs.stat(name, (err, obj) => {
      if (err) {
        console.log(err)
      }
      fs.readdir(name, function (err, files) {
        if (err) {
          console.log('error:' + err)
          return
        }
        resolve({
          ...obj,
          cover: files[0]
        })
      })

    })
  })
}

module.exports = router