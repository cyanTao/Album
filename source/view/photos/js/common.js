var common = {
  getIconByExt: function (ext) {
    ext = ext.toLowerCase()
    if (['doc', 'docx'].indexOf(ext) > -1) {
      return 'doc'
    }
    if (['xls', 'xlsx'].indexOf(ext) > -1) {
      return 'xls'
    }
    if (['ppt', 'pptx'].indexOf(ext) > -1) {
      return 'ppt'
    }
    if (['pdf'].indexOf(ext) > -1) {
      return 'pdf'
    }
    if (['jpg', 'jpeg', 'png', 'gif'].indexOf(ext) > -1) {
      return 'img'
    }
    if (['zip', 'rar'].indexOf(ext) > -1) {
      return 'zip'
    }
    if (['mp3', 'wma', 'wav', 'amr'].indexOf(ext) > -1) {
      return 'mp3'
    }
    if (['mp4'].indexOf(ext) > -1) {
      return 'mp4'
    }
    return 'others'
  }
}