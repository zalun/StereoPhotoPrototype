function SPGallery() {
  this.stereos = [];
  this.loaded = false;
  this.element = document.getElementById('gallery-list');
  var self = this;
  document.addEventListener('gallery-updated', function() {
    self.reloadFromStorage();
  }, false);
};

SPGallery.prototype.reloadFromStorage = function() {
  this.stereos = [];
  var stereoList = localStorage.getItem('stereo-list');
  stereoList = JSON.parse(stereoList);
  console.log('parsed stereoList', stereoList);
  if (stereoList) {
    for (var i = 0; i < stereoList.length; i++) {
      this.stereos.push(loadStereoFromHashtag(stereoList[i]));
    }
    this.loaded = true;
    console.log('DEBUG: loaded from storage');
  }
  var images = this.element.getElementsByTagName('div');
  if (images) {
    for (var i = 0; i < images.length; i++) {
      console.log(images[i]);
      images[i].remove();
    }
  }
  for (var i = 0; i < this.stereos.length; i++) {
    var stereo = this.stereos[i];
    var img = document.createElement('div');
    img.style.background = "url('" + stereo.icon + "')";
    // var img = document.createElement('img');
    // var img = new Image();
    // img.src = stereo.icon;
    img.stereo = stereo;
    img.addEventListener('click', function(e) {
      this.stereo.display();
    });
    console.log('created image', img.src);
    if (this.element.firstChild) {
      this.element.insertBefore(img, this.element.firstChild);
    } else {
      this.element.appendChild(img);
    }
  }
};

SPGallery.prototype.display = function() {
  app.display('gallery');
}
