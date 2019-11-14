ajax('/tools/pictures', {}, function(res) {
  var pictures = res.pictures
  var div = document.createElement('div')
  for (var i = 0; i < pictures.length; i++) {
    var btn = document.createElement('a')
    var img = document.createElement('img')
    var span = document.createElement('span')
    btn.className = 'btn'

    img.src = "./img/folder.jpg"
    span.innerHTML = pictures[i]
    btn.appendChild(img)
    btn.appendChild(span)
    btn.href = 'detail.html?name=' + pictures[i]
    div.appendChild(btn)
  }
  document.getElementsByTagName('body')[0].appendChild(div)
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
  req.onreadystatechange = function() {
    if (req.readyState == 4 && req.status == 200) {
      var data = JSON.parse(req.responseText)
      callback(data)
    }
  }
}
