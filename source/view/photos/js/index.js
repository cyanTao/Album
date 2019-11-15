ajax('/tools/pictures', {}, function (res) {
  var pictures = res.pictures
  var div = $('<div></div>')
  for (var i = 0; i < pictures.length; i++) {
    var btn = $(`<a href="${'detail.html?name=' + pictures[i]}" class="btn"></a>`)
    console.log(btn)
    btn.append($(`<span class="icon"></span><span class="text">${pictures[i]}</span>`))
    div.append(btn)
  }
  $('#content').append(div)
})

function ajax(url, param, callback) {
  url = url || ''
  param = param || {}
  var req = null
  if (window.XMLHttpRequest) {
    req = new XMLHttpRequest()
  } else {
    req = new ActiveXObject('Microsoft.XMLHTTP')
  }
  req.open('POST', url, true)
  var formData = new FormData()
  for (var key in param) {
    formData.append(key, JSON.stringify(param[key]))
  }
  req.send(formData)
  req.onreadystatechange = function () {
    if (req.readyState == 4 && req.status == 200) {
      var data = JSON.parse(req.responseText)
      callback(data)
    }
  }
}