var galleryUpdatedEvent = new Event('gallery-updated');

function stereoFromObject(obj) {
    var photoLeft = new SPPhoto(obj.photos[0].url, obj.photos[0].position);
    var photoRight = new SPPhoto(obj.photos[1].url, obj.photos[1].position);
    return new SPStereo(photoLeft, photoRight, obj.id, obj.icon, obj.rendered);
}

function SPStereo(photoLeft, photoRight, id, icon, rendered) {
    this.id = id || null;
    this.photos = [photoLeft, photoRight];
    this.icon = icon || null;
    this.rendered = rendered || null;
    this.screenWidth = Math.max(window.screen.width, window.screen.height);
    this.screenHeight = Math.min(window.screen.width, window.screen.height);
    this.halfWidth = Math.round(this.screenWidth/2);
};

SPStereo.prototype.display = function() {
    // this should simply displayed a rendered version
    var elem = document.getElementById('view');
    if (elem.requestFullscreen) {
      console.log('a');
      elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
      console.log('b');
      elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      console.log('c');
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      console.log('d');
      elem.webkitRequestFullscreen();
    } else {
      console.log('DEBUG: no full screen allowed');
    }

    var left = document.getElementById('view-left');
    left.obj = this.photos[0];
    var right = document.getElementById('view-right');
    right.obj = this.photos[1];
    app.display('view');
    left.src = this.photos[0].url;
    right.src = this.photos[1].url;
    left.setAttribute('width', this.halfWidth + 50);
    right.setAttribute('width', this.halfWidth + 50);
    left.style.left = left.obj.position.x + 'px';
    left.style.top = left.obj.position.y + 'px';
};

SPStereo.prototype.setPosition = function() {
    var self = this;

    var save = document.getElementById('save-stereo');
    function saveStereo() {
        self.save();
        save.removeEventListener('click', saveStereo);
    }
    save.addEventListener('click', saveStereo, false);

    var left = document.getElementById('position-left');
    left.obj = this.photos[0];
    var right = document.getElementById('position-right');
    right.obj = this.photos[1];
    app.display('position');
    left.src = this.photos[0].url;
    right.src = this.photos[1].url;
    left.setAttribute('width', this.halfWidth + 50);
    right.setAttribute('width', this.halfWidth + 50);
    left.style.left = left.obj.position.x + 'px';
    left.style.top = left.obj.position.y + 'px';

    var cursor = {x: 0, y: 0};

    left.addEventListener('touchstart', touchStart, false);
    left.addEventListener('touchmove', touchMove, false);
    left.addEventListener('touchend', touchEnd, false);
    right.addEventListener('touchstart', touchStart, false);
    right.addEventListener('touchmove', touchMove, false);
    right.addEventListener('touchend', touchEnd, false);

    function touchStart(evt) {
      evt.preventDefault();
      cursor.x = evt.touches[0].clientX;
      cursor.y = evt.touches[0].clientY;
    }
    function touchMove(evt) {
      evt.preventDefault();
      var delta = {
        x: evt.touches[0].clientX - cursor.x, 
        y: evt.touches[0].clientY - cursor.y 
      };
      cursor.x = evt.touches[0].clientX;
      cursor.y = evt.touches[0].clientY;
      this.obj.position.x += delta.x;
      this.obj.position.y += delta.y;
      this.style.left = this.obj.position.x + 'px';
      this.style.top = this.obj.position.y + 'px';
    }
    function touchEnd(evt) {
      evt.preventDefault();
    }

};

SPStereo.prototype.render = function() {
  // provide an icon and a full sreen rendered graphics
  this.icon = this.photos[0].url;
};

SPStereo.prototype.toObject = function() {
    return {
      "id": this.id,
      "icon": this.icon,
      "rendered": this.rendered,
      "photos": [
          {"url": this.photos[0].url, "position": this.photos[0].position},
          {"url": this.photos[1].url, "position": this.photos[1].position}
      ]
    }
};

SPStereo.prototype.setId = function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 8; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    this.id = text;
}
          
SPStereo.prototype.save = function() {
    this.render();
    // create hashtag if none
    if (!this.id) {
      this.setId();
    }
    // save to stereos list
    var stereos = localStorage.getItem('stereo-list') || '[]';
    stereos = JSON.parse(stereos);
    stereos.push(this.toObject());
    localStorage.setItem('stereo-list', JSON.stringify(stereos));
    document.dispatchEvent(galleryUpdatedEvent);
    console.log('saved in localStorage', this.id);
    app.display('gallery');
};

SPStereo.prototype.edit = function() {
    app.display('position');
    this.setPosition();
}
