const express = require('express')
const router = express.Router()
const fs = require('fs')
const upload = require('./upload.js')
const path = require('path')

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
  const folderPath = path.join(albumPath, name)
  fs.readdir(folderPath, async (err, files) => {
    if (err) {
      console.log('error:' + err)
      return
    }

    let orderResult = await sortResult(folderPath, files)
    const newArr = []
    orderResult.forEach(item => {
      let obj = {
        name: item.name,
        src: path.join(staticPath, name, item.name, item.cover),
        ctime: item.ctime
      }
      newArr.push(obj)
    })
    res.send({
      pictures: newArr
    })
  })
})

// 获取相册里面图片
router.post('/photo', (req, res) => {
  var name = req.query.name
  var target = req.query.target
  const folderPath = path.join(albumPath, name)
  fs.readdir(path.join(folderPath, target), async function (
    err,
    files
  ) {
    if (err) {
      console.log('error:' + err)
      return
    }
    const orderResult = await sortResult(path.join(folderPath, target), files)
    var newArr = []
    orderResult.forEach(item => {
      newArr.push(path.join(staticPath, name, target, item.name))
    })
    res.send({
      pictures: newArr
    })
  })
})

// 上传
router.post('/upload', upload)


function getInfo(name) {
  return new Promise(resolve => {
    fs.stat(name, (err, obj) => {
      if (err) {
        console.log(err)
      }
      // 如果是文件夹再找第一张图片作为封面
      if (obj.isDirectory()) {
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
      } else {
        resolve(obj)
      }
    })
  })
}

function sortResult(folderPath, files) {
  return new Promise(resolve => {
    const promises = []
    for (let i = 0; i < files.length; i++) {
      promises.push(getInfo(
        path.join(folderPath, files[i])
      ).then(item => {
        const result = {
          name: files[i],
          ctime: item.birthtimeMs,
          cover: item.cover
        }
        return Promise.resolve(result)
      }))
    }
    Promise.all(promises).then(result => {
      result.sort(function (a, b) {
        let result = b.ctime - a.ctime
        return result
      })
      resolve(result)
    })
  })

}

module.exports = router