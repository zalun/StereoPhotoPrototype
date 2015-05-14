function SPGallery() {
  this.stereos = [];
  this.loaded = false;
  this.element = document.getElementById('gallery');
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
  var images = this.element.getElementsByTagName('img');
  if (images) {
    for (var i = 0; i < images.length; i++) {
      images[i].destroy();
    }
  }
  console.log('stereos loaded', this.stereos);
  for (var i = 0; i < this.stereos.length; i++) {
    var img = document.createElement('div');
    var stereo = this.stereos[i];
    img.style.background = "url('" + stereo.icon + "')";
    img.stereo = stereo;
    img.addEventListener('click', function(e) {
      this.stereo.display();
    });
    console.log('created image', img.background);
    this.element.appendChild(img);
  }
};

SPGallery.prototype.display = function() {
  app.display('gallery');
}
