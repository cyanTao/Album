const crypto = require('crypto')
const mineType = require('mime-types');
const formidable = require('formidable')
const fs = require('fs')
const path = require('path')

const md5 = function (str) {
  let md5 = crypto.createHash('md5')
  let newPas = md5.update(str).digest('hex')
  return newPas
}

//上传存储临时文件夹路径
const temporary = './source/data/temporary'
//上传完成后存放文件路径
const resultPath = './source/data/static/album/'

//存放不同人上传的数据
const all = {}

const upload = (req, res) => {
  var form = new formidable.IncomingForm()
  form.uploadDir = temporary
  form.keepExtensions = true

  form.parse(req, (err, fields, files) => {
    // 文件名
    const {
      filename: name,
      index: fileIndex,
      total,
      hash: fileHash,
      folderName,
      albumName
    } = fields
    const storePath = path.join(resultPath, folderName, albumName)
    const ext = name.slice(name.lastIndexOf('.'))
    const filename = md5(name) + ext
    const fileData = files.data
    // 创建各个用户的进度记录
    if (!all[filename]) {
      all[filename] = {
        output: new Array(total),
        success: 0
      }
    }
    // 每次上传记录状态
    all[filename].output[fileIndex] = fileData
    all[filename].success++

    let {
      output,
      success
    } = all[filename]

    if (err) {
      res.send({
        success: false,
        msg: err
      })
      // 如果出错,删掉当前上传的文件和记录
      output.forEach(item => {
        fs.unlinkSync(item.path)
      })
      delete all[filename]
      throw err;
    }

    const process = `${((success / total) * 100).toFixed(2)}%`
    //文件块还没全部上传过来时
    if (Number(success) !== Number(total)) {
      res.send({
        success: true,
        process
      })
    } else {
      // 文件块全部上传完了之后,拼接在一起
      function read(i) {
        // 文件数据
        const data = fs.readFileSync(output[i].path)
        //临时文件的路径
        const temporaryPath = path.join(temporary, filename)
        // 零散的文件写入在一块文件上
        fs.appendFileSync(temporaryPath, data)
        // 删除当前写入完成的文件
        fs.unlinkSync(output[i].path)
        i++

        if (i < success) {
          read(i)
        } else {
          // 最后一块也写入完成

          // 获取文件hash
          let data = fs.readFileSync(temporaryPath);
          data = Buffer.from(data).toString('base64');
          let base64 = 'data:' + mineType.lookup(temporaryPath) + ';base64,' + data;
          const hash = md5(base64)

          // 判断文件是否原来的文件
          if (fileHash !== hash) {
            fs.unlinkSync(temporaryPath)
            res.send({
              success: false,
              msg: '文件已损坏'
            })
            return
          }

          const newPath = path.join(storePath, filename)
          fs.copyFile(temporaryPath, newPath, (err) => {
            if (err) throw err;
            fs.unlinkSync(temporaryPath)
            res.send({
              success: true,
              msg: '上传成功',
              videoUrl: newPath.replace('source',''),
              hash
            })
            // 删掉json临时记录的文件
            delete all[filename]
          })


        }
      }
      read(0)
    }
  })
}
module.exports = upload