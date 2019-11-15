let request = require('request')
let fs = require('fs')
var cheerio = require('cheerio')

class Ut {
  /**
   * 下载网络图片
   * @param {object} opts
   */
  static downImg(opts = {}, path = '') {
    return new Promise((resolve, reject) => {
      request
        .get(opts)
        .on('response', response => {
          console.log('img type:', response.headers['content-type'])
        })
        .pipe(fs.createWriteStream(path))
        .on('error', e => {
          console.log('pipe error', e)
          resolve('')
        })
        .on('finish', () => {
          console.log('finish')
          resolve('ok')
        })
        .on('close', () => {
          console.log('close')
        })
    })
  }
  /**
   * 获取网页内容
   */
  static getPage(pageUrl) {
    return new Promise((resolve, reject) => {
      request({
          url: pageUrl
        },
        function (err, response, body) {
          if (!err && response.statusCode == 200) {
            var $ = cheerio.load(body)
            resolve($)
          } else {
            reject()
            console.log('error' + pageUrl)
          }
        }
      )
    })
  }
  /**
   * 新建文件夹
   * @param {*} obj
   */
  static newDir(obj) {
    return new Promise(resolve => {
      const {
        name,
        path,
        index
      } = obj
      fs.access(name, fs.constants.F_OK, err => {
        if (err) {
          fs.mkdir(path, {
            recursive: true
          }, err => {
            if (err) throw err
            resolve(index)
          })
        } else {
          resolve()
        }
      })
    })
  }
  static newFile(name, content) {
    return new Promise(resolve => {
      fs.open(name, 'wx', (err, fd) => {
        if (err) {
          if (err.code === 'EEXIST') {
            console.error(name + '已存在')
            resolve()
          }
        }
        fs.writeFile(name, content, err => {
          if (err) throw err
          console.log('文件已被保存')
          resolve()
        })
      })
    })
  }
  //网络图片保存到本地
  static newImg(obj, dir_path) {
    return new Promise(resolve => {
      const {
        name,
        path
      } = obj
      if (!path) {
        console.log(name + ': --- 下载图片失败 ===> 没有获取到图片src')
        resolve()
        return
      }
      const fils_path = dir_path + '/' + name
      fs.access(fils_path, fs.constants.F_OK, err => {
        if (err) {
          this.downImg({
              url: path,
              headers: {
                Referer: 'https://zhihu.com'
              }
            },
            fils_path
          ).then(() => {
            resolve()
          })
        } else {
          resolve()
        }
      })
    })
  }

  //获取文件/文件夹信息
  static getInfo(name) {
    return new Promise(resolve => {
      fs.stat(name, (err, obj) => {
        if (err) {
          console.log(err)
        }
        resolve(obj)
      })
    })
  }

  static success(res, obj = {}) {
    let {
      code = 0, data = [], msg = '成功'
    } = obj
    res.send({
      code,
      data,
      msg
    })
    return
  }

  static fail(res, obj = {}) {
    let {
      code = 999, data = [], msg = '失败'
    } = obj
    res.send({
      code,
      data,
      msg
    })
    return
  }
  static sleep(time) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, time)
    })
  }
}

module.exports = Ut