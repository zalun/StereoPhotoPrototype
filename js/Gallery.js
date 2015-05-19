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
  var self = this;
  console.log('DEBUG: removing icon elements');
  var images = self.element.getElementsByTagName('div');
  if (images.length > 0) {
    for (var i = 0; i < images.length; i++) {
      console.log('.');
      images[i].remove();
    }
  }
  localforage.getItem('stereo-list').then(function(stereoList) {
    if (stereoList) {
      for (var i = 0; i < stereoList.length; i++) {
        loadStereoFromHashtag(stereoList[i]).then(function(stereo) {
          if (stereo) {
            self.stereos.push(stereo);
            self.addIcon(stereo);
          }
        });
      }
      self.loaded = true;
      console.log('DEBUG: loaded from storage');
    }
  }).catch(function(err) {
    console.log(err);
  });
};

SPGallery.prototype.display = function() {
  app.display('gallery');
};

SPGallery.prototype.addIcon = function(stereo) {
  console.log('DEBUG: display icon for', stereo.id);
  var icon = document.createElement('div');
  icon.setAttribute('id', 'icon-' + stereo.id);
  icon.style.background = "url('" + stereo.icon + "')";
  var deleteButton = document.createElement('a');
  deleteButton.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('delete');
    this.parentNode.stereo.delete();
  });
  icon.appendChild(deleteButton);
  icon.stereo = stereo;
  icon.addEventListener('click', function(e) {
    this.stereo.display();
  });
  if (this.element.firstChild) {
    this.element.insertBefore(icon, this.element.firstChild);
  } else {
    this.element.appendChild(icon);
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
  localforage.setItem('stereo-list', stereoList);
};

SPGallery.prototype.fixStereoListDelete = function(hashtag) {
  localforage.getItem('stereo-list').then(function(stereos){
    stereos.splice(stereos.indexOf(hashtag), 1);
    localforage.setItem('stereo-list', stereos);
  });
};
