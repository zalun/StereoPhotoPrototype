/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    takePhotos: function() {
        // take left photo
        navigator.camera.getPicture(function(dataURL) {
          console.log('WTF');
          var left = new SPPhoto(dataURL);
          navigator.camera.getPicture(function(dataURL) {
            var right = new SPPhoto(dataURL);
            var stereo = new SPStereo(left, right, app.screenWidth, app.screenHeight);
            stereo.setPosition(function() {
              stereo.save();
            });
          }, function() {
            console.log('error (right)');
          }, {destinationType: Camera.DestinationType.FILE_URI});

        }, function() {
          console.log('error (left)');
        }, {destinationType: Camera.DestinationType.FILE_URI});
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        // localStorage.removeItem('stereo-list');
        var takePhotoButton = document.getElementById('take-photo-button');
        takePhotoButton.addEventListener('click', app.takePhotos, false);
        app.gallery = new SPGallery();
        app.gallery.reloadFromStorage();
        app.gallery.display();
        var galleryButtons = document.getElementsByClassName('back-gallery');
        for (var i = 0; i < galleryButtons.length; i++) {
          galleryButtons[i].addEventListener('click', function() {
            app.display('gallery');
          });
        }
    },

    display: function(section) {
        // var elem = document.getElementById('view');
        // if (elem.exitFullScreen) {
        //   elem.exitFullScreen();
        // } else if (elem.msExitFullScreen) {
        //   elem.msExitFullScreen();
        // } else if (elem.mozCancelFullScreen) {
        //   elem.mozCancelFullScreen();
        // } else if (elem.webkitExitFullscreen) {
        //   elem.webkitExitFullScreen();
        // } else {
        //   console.log('no exit from full screen');
        // }
        var sections = document.getElementsByTagName('section');
        for (var i=0; i < sections.length; i++) {
          sections[i].style.display = 'none';
        }
        document.getElementById(section).style.display = 'block';
    }
};

app.initialize();
