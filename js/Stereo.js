var galleryUpdatedEvent = new Event('gallery-updated');

function loadStereoFromHashtag(hashtag) {
  return new Promise(function(resolve, reject) {
    localforage.getItem('stereo-' + hashtag).then(function(obj) {
      if (obj) {
        resolve(stereoFromObject(obj));
      } else {
        console.log('DEBUG: wrong id in storage, deleting', hashtag);
        app.gallery.fixStereoListDelete(hashtag);
        throw new Error('no such stereo ' + hashtag);
      }
    });
  });
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
    this.screen = {
      width: Math.max(window.screen.width, window.screen.height),
      height: Math.min(window.screen.width, window.screen.height),
    };
    this.scale = 2;
    this.scaled = {
      width: this.screen.width * this.scale,
      height: this.screen.height * this.scale 
    };
    this.screen.half = Math.round(this.screen.width / 2);
    this.scaled.half = Math.round(this.scaled.width / 2);
};

SPStereo.prototype.takePicture = function() {
};

SPStereo.prototype.display = function() {
    var image = document.getElementById('view-image');
    image.src = this.rendered;
    image.setAttribute('width', this.screen.width);
    app.display('view');
};

SPStereo.prototype.setPosition = function() {
    var self = this;

    var left = document.getElementById('position-left');
    var right = document.getElementById('position-right');

    var save = document.getElementById('save-stereo');
    function saveStereo() {
        console.log('saveStereo');
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
    left.setAttribute('width', this.screen.half + 50);
    right.setAttribute('width', this.screen.half + 50);
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
  canvas.width = this.scaled.width;
  canvas.height = this.scaled.height;
  console.log('canvas', this.scaled.width, this.scaled.height);
  console.log('left', this.photos[0].position.x, this.photos[0].position.x * this.scale);
  // fill the whole canvas
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // ------------------------
  // console.log('a');
  // resample_hermite(canvas, left, 
  //        this.photos[0].position.x, this.photos[0].position.y, 
  //        this.leftSize.width, this.leftSize.height);
  // console.log('b');
  // resample_hermite(canvas, right, 
  //        this.halfWidth + this.photos[1].position.x, this.photos[1].position.y, 
  //        this.rightSize.width, this.rightSize.height);
  // console.log('c');
  // ------------------------
  ctx.save();
  ctx.drawImage(left, 
      this.photos[0].position.x * this.scale, 
      this.photos[0].position.y * this.scale, 
      this.leftSize.width * this.scale, this.leftSize.height * this.scale);
  ctx.fillRect(this.scaled.half, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(this.scaled.half, 0);
  ctx.lineTo(this.scaled.width, 0);
  ctx.lineTo(this.scaled.width, this.scaled.height);
  ctx.lineTo(this.scaled.half, this.scaled.height);
  ctx.lineTo(this.scaled.half, 0);
  ctx.clip();
  console.log(this.photos[1].position.x * this.scale);
  ctx.drawImage(right, 
      this.scaled.half + (this.photos[1].position.x * this.scale), 
      this.photos[1].position.y * this.scale, 
      this.rightSize.width * this.scale, this.rightSize.height * this.scale);
  ctx.restore();
  // ------------------------
  this.rendered = canvas.toDataURL("image/png");
  console.log('DEBUG: view render completed');
};

SPStereo.prototype.renderIcon = function(image) {
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext('2d');
  canvas.width = 100;
  canvas.height = 100;
  console.log('making icon from', image);
  ctx.drawImage(image, 0, 0, 200, image.naturalHeight*200/image.naturalWidth);
  this.icon = canvas.toDataURL("image/png");
  console.log(this.icon);
};

SPStereo.prototype.render = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    // provide an icon and a full sreen rendered graphics
    var left = document.getElementById('position-left');
    var right = document.getElementById('position-right');
    self.renderView(left, right);
    var image = new Image();
    image.addEventListener('load', function() {
      self.renderIcon(image);
      resolve();
    });
    image.src = self.rendered;
  });
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
  var self = this;
  var updateList = false;
  app.display('gallery');

  self.render().then(function() {
    // create hashtag if none
    console.log(self);
    if (!self.id) {
      self.setId();
      updateList = true;
    }

    // save to storage
    localforage.setItem('stereo-' + self.id, self.toObject()).then(function() {
      console.log('saved in localforage', self.id);
    });

    // save to stereos list
    if (updateList) {
      app.gallery.addStereo(self);
    }
  }).catch(function(err) {
    console.log('Some error', err);
    app.display('position');
    alert('error');
  });
};

SPStereo.prototype.edit = function() {
    app.display('position');
    this.setPosition();
};

SPStereo.prototype.delete = function() {
  localforage.removeItem('stereo-' + this.id);
  app.gallery.deleteStereo(this);
  console.log('removed', this.id);
};
