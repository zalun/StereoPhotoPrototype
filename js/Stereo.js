var galleryUpdatedEvent = new Event('gallery-updated');

function loadStereoFromHashtag(hashtag) {
    var obj = localStorage.getItem('stereo-' + hashtag);
    if (obj) {
      return stereoFromObject(JSON.parse(obj));
    } else {
      console.log('DEBUG: wrong id in storage, deleting', hashtag);
      return app.gallery.fixStereoListDelete(hashtag);
    }
}

function stereoFromObject(obj) {
    var photoLeft = new SPPhoto(obj.photos[0].url, obj.photos[0].position);
    var photoRight = new SPPhoto(obj.photos[1].url, obj.photos[1].position);
    return new SPStereo(photoLeft, photoRight, obj.id, obj.icon, obj.rendered);
}

function SPPhoto(url, position) {
    this.url = url;
    this.position = position || {x: 0, y: 0};  // (in px)
};

function SPStereo(photoLeft, photoRight, id, icon, rendered) {
    this.id = id || null;
    this.photos = [photoLeft, photoRight];
    this.icon = icon || null;
    this.rendered = rendered || null;
    this.screenWidth = Math.max(window.screen.width, window.screen.height);
    this.screenHeight = Math.min(window.screen.width, window.screen.height);
    this.halfWidth = Math.round(this.screenWidth/2);
};

SPStereo.prototype.takePicture = function() {
};

SPStereo.prototype.display = function() {
    // this should simply displayed a rendered version
    /* var elem = document.getElementById('view'); */
    // if (elem.requestFullscreen) {
    //   elem.requestFullscreen();
    // } else if (elem.msRequestFullscreen) {
    //   elem.msRequestFullscreen();
    // } else if (elem.mozRequestFullScreen) {
    //   elem.mozRequestFullScreen();
    // } else if (elem.webkitRequestFullscreen) {
    //   elem.webkitRequestFullscreen();
    // } else {
    //   console.log('DEBUG: no full screen allowed');
    // }

    var image = document.getElementById('view-image');
    image.src = this.rendered;
    image.setAttribute('width', this.screenWidth);
    // var left = document.getElementById('view-left');
    // left.obj = this.photos[0];
    // var right = document.getElementById('view-right');
    // right.obj = this.photos[1];
    app.display('view');
    // left.src = this.photos[0].url;
    // right.src = this.photos[1].url;
    // console.log(left.src);
    // left.setAttribute('width', this.halfWidth + 50);
    // right.setAttribute('width', this.halfWidth + 50);
    // left.style.left = left.obj.position.x + 'px';
    // left.style.top = left.obj.position.y + 'px';
    // right.style.left = right.obj.position.x + 'px';
    // right.style.top = right.obj.position.y + 'px';
};

SPStereo.prototype.setPosition = function() {
    var self = this;

    var left = document.getElementById('position-left');
    var right = document.getElementById('position-right');

    var save = document.getElementById('save-stereo');
    function saveStereo() {
        self.leftSize = { width: left.width, height: left.height };
        self.rightSize = { width: right.width, height: right.height };
        console.log(self.leftSize);
        self.save();
        save.removeEventListener('click', saveStereo);
    }
    save.addEventListener('click', saveStereo, false);
    left.obj = this.photos[0];
    right.obj = this.photos[1];
    app.display('position');
    
    left.src = this.photos[0].url;
    right.src = this.photos[1].url;
    left.setAttribute('width', this.halfWidth + 50);
    right.setAttribute('width', this.halfWidth + 50);
    left.style.left = left.obj.position.x + 'px';
    left.style.top = left.obj.position.y + 'px';
    right.style.left = right.obj.position.x + 'px';
    right.style.top = right.obj.position.y + 'px';

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

SPStereo.prototype.renderView = function(left, right) {
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext('2d');
  canvas.width = this.screenWidth;
  canvas.height = this.screenHeight;
  ctx.save();
  // for some reason we're not clipping here
  // ctx.fillRect(0,0,this.halfWidth-1, this.screenHeight-1);
  // ctx.clip();
  ctx.drawImage(left, 
      this.photos[0].position.x, this.photos[0].position.y, 
      this.leftSize.width, this.leftSize.height);
  ctx.beginPath();
  ctx.moveTo(this.halfWidth, 0);
  ctx.lineTo(this.screenWidth, 0);
  ctx.lineTo(this.screenWidth, this.screenHeight);
  ctx.lineTo(this.halfWidth, this.screenHeight);
  ctx.lineTo(this.halfWidth, 0);
  ctx.clip();
  ctx.drawImage(right, 
      this.halfWidth + this.photos[1].position.x, this.photos[1].position.y, 
      this.rightSize.width, this.rightSize.height);
  ctx.restore();
  this.rendered = canvas.toDataURL("image/png");
};

SPStereo.prototype.renderIcon = function(left) {
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext('2d');
  canvas.width = 100;
  canvas.height = 100;
  ctx.drawImage(left, 0, 0, 100, this.leftSize.height*100/this.leftSize.width);
  this.icon = canvas.toDataURL("image/png");
};

SPStereo.prototype.render = function() {
  // provide an icon and a full sreen rendered graphics
  var left = document.getElementById('position-left');
  var right = document.getElementById('position-right');
  this.renderView(left, right);
  this.renderIcon(left);
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
};
          
SPStereo.prototype.save = function() {
    var updateList = false;
    app.display('gallery');

    this.render();
    // create hashtag if none
    if (!this.id) {
      this.setId();
      updateList = true;
    }
    // save to storage
    var stereo = JSON.stringify(this.toObject());
    localStorage.setItem('stereo-' + this.id, stereo);

    // save to stereos list
    if (updateList) {
      app.gallery.addStereo(this);
    }
    console.log('saved in localStorage', this.id);
};

SPStereo.prototype.edit = function() {
    app.display('position');
    this.setPosition();
};

SPStereo.prototype.delete = function() {
  localStorage.removeItem('stereo-' + this.id);
  app.gallery.deleteStereo(this);
  console.log('removed', this.id);
};
