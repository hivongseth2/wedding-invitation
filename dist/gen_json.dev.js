"use strict";

var fs = require('fs').promises;

var path = require('path');

var jsmediatags = require('jsmediatags');

function generateJsonFiles() {
  var musicDir, files, musicFiles, songPromises, songs, imagesDir, imageFiles;
  return regeneratorRuntime.async(function generateJsonFiles$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // Quét thư mục music
          musicDir = path.join(__dirname, 'public/music');
          _context.next = 3;
          return regeneratorRuntime.awrap(fs.readdir(musicDir));

        case 3:
          files = _context.sent;
          musicFiles = files.filter(function (file) {
            return file.endsWith('.mp3');
          });
          songPromises = musicFiles.map(function (file) {
            return new Promise(function (resolve) {
              jsmediatags.read(path.join(musicDir, file), {
                onSuccess: function onSuccess(tag) {
                  resolve({
                    url: "music/".concat(file),
                    title: tag.tags.title || file.replace('.mp3', ''),
                    album: tag.tags.album || 'Unknown Album'
                  });
                },
                onError: function onError() {
                  resolve({
                    url: "music/".concat(file),
                    title: file.replace('.mp3', ''),
                    album: 'Unknown Album'
                  });
                }
              });
            });
          });
          _context.next = 8;
          return regeneratorRuntime.awrap(Promise.all(songPromises));

        case 8:
          songs = _context.sent;
          // Quét thư mục images1
          imagesDir = path.join(__dirname, 'public/images');
          _context.next = 12;
          return regeneratorRuntime.awrap(fs.readdir(imagesDir));

        case 12:
          _context.t0 = function (file) {
            return /\.(jpg|jpeg|png|gif)$/i.test(file);
          };

          _context.t1 = function (file) {
            return "images1/".concat(file);
          };

          imageFiles = _context.sent.filter(_context.t0).map(_context.t1);
          _context.next = 17;
          return regeneratorRuntime.awrap(fs.writeFile('public/songs.json', JSON.stringify(songs, null, 2)));

        case 17:
          _context.next = 19;
          return regeneratorRuntime.awrap(fs.writeFile('public/images.json', JSON.stringify(imageFiles, null, 2)));

        case 19:
          console.log('Generated songs.json and images.json');

        case 20:
        case "end":
          return _context.stop();
      }
    }
  });
}

generateJsonFiles()["catch"](console.error);