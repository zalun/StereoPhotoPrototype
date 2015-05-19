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
  console.log('Updating stereoList', stereoList);
  if (stereoList) {
    for (var i = 0; i < stereoList.length; i++) {
      var stereo = loadStereoFromHashtag(stereoList[i]);
      if (stereo) {
        this.stereos.push(stereo);
      }
    }
    this.loaded = true;
    console.log('DEBUG: loaded from storage');
  }
  console.log('DEBUG: removing icon elements');
  var images = this.element.getElementsByTagName('div');
  if (images.length > 0) {
    for (var i = 0; i < images.length; i++) {
      console.log('.');
      images[i].remove();
    }
  }
  for (var i = 0; i < this.stereos.length; i++) {
    this.addIcon(this.stereos[i]);
  }
};

SPGallery.prototype.display = function() {
  app.display('gallery');
};

SPGallery.prototype.addIcon = function(stereo) {
  console.log('display icon for', stereo.id);
  var img = document.createElement('div');
  img.setAttribute('id', 'icon-' + stereo.id);
  img.style.background = "url('" + stereo.icon + "')";
  img.stereo = stereo;
  img.addEventListener('click', function(e) {
    this.stereo.display();
  });
  if (this.element.firstChild) {
    this.element.insertBefore(img, this.element.firstChild);
  } else {
    this.element.appendChild(img);
  }
}

SPGallery.prototype.addStereo = function(stereo) {
  this.stereos.push(stereo);
  this.addIcon(stereo);
  this.save();
};

SPGallery.prototype.deleteStereo = function(stereo) {
  this.stereos.splice(this.stereos.indexOf(stereo), 1);
  var icon = document.getElementById('icon-' + stereo.id);
  if (icon) {
    icon.remove();
  }
  this.save();
};

SPGallery.prototype.save = function() {
  var stereoList = this.stereos.map(function(stereo) {
    return stereo.id; 
  });
  console.log(this.stereos, stereoList);
  localStorage.setItem('stereo-list', JSON.stringify(stereoList));
};

SPGallery.prototype.fixStereoListDelete = function(hashtag) {
  var stereos = JSON.parse(localStorage.getItem('stereo-list'));
  stereos.splice(stereos.indexOf(hashtag), 1);
  localStorage.setItem('stereo-list', JSON.stringify(stereos));
};
