import React, { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Play, Pause, SkipBack, SkipForward, Music, Shuffle, Repeat, Minimize2, Maximize2 } from 'lucide-react';
import { useLoadData, useGsapAnimations, useAudioControls } from './playerLogic';
import './MusicPlayer.css';

const MusicPlayer = () => {
  const t1 = useRef(gsap.timeline({ paused: true, reversed: true }));
  const t2 = useRef(gsap.timeline({ paused: true, reversed: true }));
  const playerTrackRef = useRef(null);
  const albumArtRef = useRef(null);
  const audioRef = useRef(null);
  const seekBarRef = useRef(null);
  const playerContainerRef = useRef(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [trackLength, setTrackLength] = useState('00:00');
  const [seekProgress, setSeekProgress] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [songs, setSongs] = useState([]);
  const [images, setImages] = useState([]);
  const [repeatMode, setRepeatMode] = useState('none'); // none, all, one
  const [isMinimized, setIsMinimized] = useState(false); // Minimize state

  useLoadData(setSongs, setImages);
  const { togglePlaylist } = useGsapAnimations(songs, t1, t2, playerTrackRef, albumArtRef);

  const {
    handlePlayPause,
    handlePrevious,
    handleNext,
    handleRandom,
    handleSeek,
    handleSongSelect,
    handleRepeat,
    handleSeekStart,
    handleSeekEnd,
  } = useAudioControls(
    audioRef,
    playerTrackRef,
    albumArtRef,
    seekBarRef,
    currentSongIndex,
    isPlaying,
    isSeeking,
    setIsSeeking,
    setCurrentSongIndex,
    setIsPlaying,
    setCurrentTime,
    setTrackLength,
    setSeekProgress,
    songs,
    repeatMode,
    setRepeatMode
  );

  const handleMinimizeToggle = () => {
    setIsMinimized(!isMinimized);
    setShowPlaylist(false); // Close playlist when minimizing
    gsap.to(playerContainerRef.current, {
      y: isMinimized ? '0%' : 'calc(100% - 60px)', // Slide to bottom when minimized
      duration: 0.3,
      ease: 'power1.inOut',
    });
  };

  if (songs.length === 0) {
    return <div>Loading songs...</div>;
  }

  const currentSong = songs[currentSongIndex] || { title: 'Loading...', album: '', url: '', image: '' };

  return (
    <div>
      <div className="player-bg-artwork" style={{ backgroundImage: `url(${currentSong.image})` }}></div>
      <div className="player-bg-layer"></div>
      <div className="player-container" ref={playerContainerRef}>
        <div className={`player ${isMinimized ? 'minimized' : ''}`}>
          {isMinimized ? (
            // Minimized View
            <div className="player-minimized">
              <div className="track-name">{currentSong.title}</div>
              <div className="control">
                <div className="button" onClick={handlePlayPause} title="Play/Pause">
                  {isPlaying ? <Pause size={20} color="#e91e63" /> : <Play size={20} color="#e91e63" />}
                </div>
              </div>
              <div className="control">
                <div className="button minimize-toggle" onClick={handleMinimizeToggle} title="Maximize">
                  <Maximize2 size={20} color="#e91e63" />
                </div>
              </div>
            </div>
          ) : (
            // Full View
            <>
              <div className="player-track" ref={playerTrackRef}>
                <div className="track-name">{currentSong.title}</div>
                <div className="album-desc" style={{ opacity: 1 }}></div>
              </div>
              <div
                className="player-content"
                style={{
                  backgroundImage: `url(${currentSong.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="album-art" ref={albumArtRef}>
                  <img
                    src={currentSong.image}
                    alt="Album Art"
                    className={isPlaying ? 'active' : ''}
                    onError={() => console.error('Image failed to load:', currentSong.image)}
                  />
                  <div className="buffer-box">Buffering...</div>
                </div>
                <div className="player-controls">
                  <div className="control">
                    <div className="button" onClick={handlePrevious} title="Previous">
                      <SkipBack size={26} color="#e91e63" />
                    </div>
                  </div>
                  <div className="control">
                    <div className="button" onClick={handleRandom} title="Random">
                      <Shuffle size={26} color="#e91e63" />
                    </div>
                  </div>
                  <div className="control">
                    <div className="button" onClick={handlePlayPause} title="Play/Pause">
                      {isPlaying ? <Pause size={26} color="#e91e63" /> : <Play size={26} color="#e91e63" />}
                    </div>
                  </div>
                  <div className="control">
                    <div className="button" onClick={handleNext} title="Next">
                      <SkipForward size={26} color="#e91e63" />
                    </div>
                  </div>
                  <div className="control">
                    <div className="button" onClick={handleRepeat} title={`Repeat: ${repeatMode}`}>
                      <Repeat
                        size={26}
                        color={repeatMode !== 'none' ? '#e91e63' : '#999'}
                        style={{ opacity: repeatMode === 'one' ? 0.7 : 1 }}
                      />
                    </div>
                  </div>
                  <div className="control minimize-toggle">
                    <div className="button" onClick={handleMinimizeToggle} title="Minimize">
                      <Minimize2 size={26} color="#e91e63" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="track-time active">
                <div className="current-time">{currentTime}</div>
                <div className="track-length">{trackLength}</div>
              </div>
              <div className="seek-bar-container">
                <div className="seek-time">00:00</div>
                <div className="s-hover"></div>
                <input
                  type="range"
                  className="seek-bar"
                  ref={seekBarRef}
                  value={seekProgress}
                  onChange={handleSeek}
                  onInput={handleSeek}
                  onMouseDown={handleSeekStart}
                  onMouseUp={handleSeekEnd}
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
              <div className="playlist-toggle" onClick={() => togglePlaylist(showPlaylist, setShowPlaylist)}>
                <Music size={24} /> Playlist
              </div>
              <div className="song-list" style={{ height: showPlaylist ? 'auto' : 0, opacity: showPlaylist ? 1 : 0 }}>
                {songs.map((song, index) => (
                  <div
                    key={index}
                    className={`song-item ${index === currentSongIndex ? 'active' : ''}`}
                    onClick={() => handleSongSelect(index)}
                  >
                    <Music size={20} /> {song.title}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <audio ref={audioRef} src={currentSong.url} />
      </div>
    </div>
  );
};

export default MusicPlayer;