(function ($) {

  var Uploader = function (path) {
    var self = this,
        url = ['http://localhost:3000', path].join('')

    this.xhr = new XMLHttpRequest
    this.xhr.open('POST', url)
    this.completeCallbacks = []
    this.progressCallbacks = []

    this.xhr.onprogress = function (e) {
      if (!e.lengthComputable) return
      var percentComplete = e.loaded / e.total
      self.progressCallbacks.forEach(function (fn) {
        fn(percentComplete)
      })
    }

    this.xhr.onload = function () {
      var imageId = JSON.parse(self.xhr.responseText).id
      self.completeCallbacks.forEach(function (fn) {
        fn(imageId)
      })
    }
  }

  Uploader.prototype = {
    send: function (file) {
      var formData = new FormData
      formData.append('image', file)
      this.xhr.send(formData)
    },

    onComplete: function (fn) {
      this.completeCallbacks.push(fn)
    },

    onProgress: function (fn) {
      this.progressCallbacks.push(fn)
    }
  }

  $.fn.uploader = function () {
    var hiddenInput = this,
        fileInput = $('<input type="file"></input>'),
        path = hiddenInput.data('url')

    hiddenInput.after(fileInput)

    fileInput.bind('change', function () {
      uploader = new Uploader (path)

      uploader.onComplete(function (id) {
        hiddenInput.val(id)
      })

      uploader.onProgress(function (percentComplete) {
        console.log(percentComplete)
      })

      uploader.send(this.files[0])
    })
  }
})(jQuery)