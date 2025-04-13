"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAudioControls = exports.useGsapAnimations = exports.useLoadData = exports.getRandomImage = void 0;

var _react = require("react");

var _gsap = require("gsap");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// Hàm chọn ảnh ngẫu nhiên
var getRandomImage = function getRandomImage(imageFiles) {
  if (!imageFiles || imageFiles.length === 0) return '/images1/default.jpg';
  var randomIndex = Math.floor(Math.random() * imageFiles.length);
  return "/".concat(imageFiles[randomIndex]);
}; // Tải dữ liệu bài hát và hình ảnh


exports.getRandomImage = getRandomImage;

var useLoadData = function useLoadData(setSongs, setImages) {
  (0, _react.useEffect)(function () {
    Promise.all([fetch('/songs.json').then(function (res) {
      return res.json();
    }), fetch('/images.json').then(function (res) {
      return res.json();
    })]).then(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          songList = _ref2[0],
          imageFiles = _ref2[1];

      setImages(imageFiles);
      setSongs(songList.map(function (song) {
        return _objectSpread({}, song, {
          image: getRandomImage(imageFiles)
        });
      }));
    })["catch"](function (error) {
      return console.error('Error loading data:', error);
    });
  }, [setSongs, setImages]);
}; // Cập nhật GSAP timeline


exports.useLoadData = useLoadData;

var useGsapAnimations = function useGsapAnimations(songs, t1, t2, playerTrackRef, albumArtRef) {
  (0, _react.useEffect)(function () {
    t1.current.to('.player-track', {
      ease: 'power1.inOut',
      top: -92,
      duration: 0.3
    }, 0).to('.album-art', {
      ease: 'power1.inOut',
      top: -60,
      boxShadow: '0 0 0 4px #fff7f7, 0 30px 50px -15px #afb7c1',
      duration: 0.3
    }, 0).to('.album-release', {
      ease: 'power1.inOut',
      opacity: 1
    }, 0.5).to('.album-desc', {
      ease: 'power1.inOut',
      opacity: 1
    }, 0.5);
    t2.current = _gsap.gsap.timeline({
      paused: true,
      reversed: true
    }).to('.song-list', {
      ease: 'power1.inOut',
      height: 'auto',
      opacity: 1,
      duration: 0.5
    });
    document.querySelectorAll('.song-item').forEach(function (item, index) {
      t2.current.to(item, {
        ease: 'power1.inOut',
        x: 20,
        opacity: 1,
        duration: 0.3
      }, index * 0.05);
    });
  }, [songs, t1, t2]);
  return {
    togglePlaylist: function togglePlaylist(showPlaylist, setShowPlaylist) {
      setShowPlaylist(!showPlaylist);

      if (!showPlaylist) {
        t2.current.play();
      } else {
        t2.current.reverse();
      }
    }
  };
}; // Xử lý audio và điều khiển


exports.useGsapAnimations = useGsapAnimations;

var useAudioControls = function useAudioControls(audioRef, playerTrackRef, albumArtRef, seekBarRef, currentSongIndex, isPlaying, isSeeking, setIsSeeking, setCurrentSongIndex, setIsPlaying, setCurrentTime, setTrackLength, setSeekProgress, songs, repeatMode, setRepeatMode) {
  var t1 = (0, _react.useRef)(_gsap.gsap.timeline({
    paused: true,
    reversed: true
  })); // Xử lý audio events

  (0, _react.useEffect)(function () {
    var audio = audioRef.current;
    if (!audio) return;

    var updateTime = function updateTime() {
      if (audio.duration && !isNaN(audio.duration)) {
        var curMinutes = Math.floor(audio.currentTime / 60);
        var curSeconds = Math.floor(audio.currentTime - curMinutes * 60);
        var durMinutes = Math.floor(audio.duration / 60);
        var durSeconds = Math.floor(audio.duration - durMinutes * 60);
        setCurrentTime("".concat(curMinutes < 10 ? '0' : '').concat(curMinutes, ":").concat(curSeconds < 10 ? '0' : '').concat(curSeconds));
        setTrackLength("".concat(durMinutes < 10 ? '0' : '').concat(durMinutes, ":").concat(durSeconds < 10 ? '0' : '').concat(durSeconds));

        if (!isSeeking) {
          setSeekProgress(audio.currentTime / audio.duration * 100);
        }
      }
    };

    var handleSongEnd = function handleSongEnd() {
      if (repeatMode === 'one') {
        // Lặp lại bài hiện tại
        audio.currentTime = 0;
        audio.play()["catch"](function (err) {
          return console.error('Play error:', err);
        });
      } else if (repeatMode === 'all' && currentSongIndex === songs.length - 1) {
        // Lặp lại danh sách
        setCurrentSongIndex(0);
        audio.load();
      } else {
        // Chuyển bài tiếp theo
        handleNext();
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleSongEnd);
    audio.addEventListener('loadedmetadata', function () {
      setTrackLength("".concat(Math.floor(audio.duration / 60) < 10 ? '0' : '').concat(Math.floor(audio.duration / 60), ":").concat(Math.floor(audio.duration % 60) < 10 ? '0' : '').concat(Math.floor(audio.duration % 60)));
    }); // Tự động phát khi audio sẵn sàng nếu đang ở trạng thái isPlaying

    var handleCanPlay = function handleCanPlay() {
      if (isPlaying) {
        audio.play()["catch"](function (err) {
          return console.error('Play error:', err);
        });
      }
    };

    audio.addEventListener('canplay', handleCanPlay);
    return function () {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleSongEnd);
      audio.removeEventListener('loadedmetadata', function () {});
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [audioRef, currentSongIndex, isSeeking, isPlaying, repeatMode, songs, setCurrentTime, setTrackLength, setSeekProgress]); // Hàm điều khiển

  var handlePlayPause = function handlePlayPause() {
    var audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      t1.current.reverse();
      playerTrackRef.current.classList.remove('active');
      albumArtRef.current.classList.remove('active');
    } else {
      audio.play()["catch"](function (err) {
        return console.error('Play error:', err);
      });
      setIsPlaying(true);
      t1.current.play();
      playerTrackRef.current.classList.add('active');
      albumArtRef.current.classList.add('active');
    }
  };

  var handlePrevious = function handlePrevious() {
    var newIndex = currentSongIndex > 0 ? currentSongIndex - 1 : songs.length - 1;
    setCurrentSongIndex(newIndex);

    if (isPlaying && audioRef.current) {
      audioRef.current.load();
    }
  };

  var handleNext = function handleNext() {
    var newIndex = currentSongIndex < songs.length - 1 ? currentSongIndex + 1 : 0;
    setCurrentSongIndex(newIndex);

    if (isPlaying && audioRef.current) {
      audioRef.current.load();
    }
  };

  var handleRandom = function handleRandom() {
    var newIndex = Math.floor(Math.random() * songs.length);
    setCurrentSongIndex(newIndex);

    if (isPlaying && audioRef.current) {
      audioRef.current.load();
    }
  };

  var handleSeek = function handleSeek(e) {
    var audio = audioRef.current;

    if (audio && audio.duration && !isNaN(audio.duration)) {
      var seekPos = parseFloat(e.target.value) / 100 * audio.duration;
      audio.currentTime = seekPos;
      setSeekProgress(parseFloat(e.target.value));
    }
  };

  var handleSongSelect = function handleSongSelect(index) {
    setCurrentSongIndex(index);

    if (isPlaying && audioRef.current) {
      audioRef.current.load();
    }
  };

  var handleRepeat = function handleRepeat() {
    var modes = ['none', 'all', 'one'];
    var currentIndex = modes.indexOf(repeatMode);
    var nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  return {
    handlePlayPause: handlePlayPause,
    handlePrevious: handlePrevious,
    handleNext: handleNext,
    handleRandom: handleRandom,
    handleSeek: handleSeek,
    handleSongSelect: handleSongSelect,
    handleRepeat: handleRepeat,
    handleSeekStart: function handleSeekStart() {
      return setIsSeeking(true);
    },
    handleSeekEnd: function handleSeekEnd() {
      return setIsSeeking(false);
    }
  };
};

exports.useAudioControls = useAudioControls;