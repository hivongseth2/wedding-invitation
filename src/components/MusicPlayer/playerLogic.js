import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export const getRandomImage = (imageFiles) => {
  if (!imageFiles || imageFiles.length === 0) return '/images1/default.jpg';
  const randomIndex = Math.floor(Math.random() * imageFiles.length);
  return `/${imageFiles[randomIndex]}`;
};

export const useLoadData = (setSongs, setImages) => {
  useEffect(() => {
    Promise.all([
      fetch('/songs.json').then((res) => res.json()),
      fetch('/images.json').then((res) => res.json()),
    ])
      .then(([songList, imageFiles]) => {
        setImages(imageFiles);
        setSongs(
          songList.map((song) => ({
            ...song,
            image: getRandomImage(imageFiles),
          }))
        );
      })
      .catch((error) => console.error('Error loading data:', error));
  }, [setSongs, setImages]);
};

export const useGsapAnimations = (songs, t1, t2, playerTrackRef, albumArtRef) => {
  useEffect(() => {
    t1.current
      .to('.player-track', { ease: 'power1.inOut', top: -92, duration: 0.3 }, 0)
      .to(
        '.album-art',
        {
          ease: 'power1.inOut',
          top: -60,
          boxShadow: '0 0 0 4px #fff7f7, 0 30px 50px -15px #afb7c1',
          duration: 0.3,
        },
        0
      )
      .to('.album-release', { ease: 'power1.inOut', opacity: 1 }, 0.5)
      .to('.album-desc', { ease: 'power1.inOut', opacity: 1 }, 0.5);

    t2.current = gsap.timeline({ paused: true, reversed: true }).to('.song-list', {
      ease: 'power1.inOut',
      height: 'auto',
      opacity: 1,
      duration: 0.5,
    });

    document.querySelectorAll('.song-item').forEach((item, index) => {
      t2.current.to(
        item,
        {
          ease: 'power1.inOut',
          x: 20,
          opacity: 1,
          duration: 0.3,
        },
        index * 0.05
      );
    });
  }, [songs, t1, t2]);

  return {
    togglePlaylist: (showPlaylist, setShowPlaylist) => {
      setShowPlaylist(!showPlaylist);
      if (!showPlaylist) {
        t2.current.play();
      } else {
        t2.current.reverse();
      }
    },
  };
};

export const useAudioControls = (
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
) => {
  const t1 = useRef(gsap.timeline({ paused: true, reversed: true }));

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        const curMinutes = Math.floor(audio.currentTime / 60);
        const curSeconds = Math.floor(audio.currentTime - curMinutes * 60);
        const durMinutes = Math.floor(audio.duration / 60);
        const durSeconds = Math.floor(audio.duration - durMinutes * 60);

        setCurrentTime(
          `${curMinutes < 10 ? '0' : ''}${curMinutes}:${curSeconds < 10 ? '0' : ''}${curSeconds}`
        );
        setTrackLength(
          `${durMinutes < 10 ? '0' : ''}${durMinutes}:${durSeconds < 10 ? '0' : ''}${durSeconds}`
        );
        if (!isSeeking) {
          setSeekProgress((audio.currentTime / audio.duration) * 100);
        }
      }
    };

    const handleSongEnd = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch((err) => console.error('Play error:', err));
      } else if (repeatMode === 'all' && currentSongIndex === songs.length - 1) {
        setCurrentSongIndex(0);
        audio.load();
      } else {
        handleNext();
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleSongEnd);
    audio.addEventListener('loadedmetadata', () => {
      setTrackLength(
        `${Math.floor(audio.duration / 60) < 10 ? '0' : ''}${Math.floor(
          audio.duration / 60
        )}:${Math.floor(audio.duration % 60) < 10 ? '0' : ''}${Math.floor(audio.duration % 60)}`
      );
    });

    const handleCanPlay = () => {
      if (isPlaying) {
        audio.play().catch((err) => console.error('Play error:', err));
      }
    };
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleSongEnd);
      audio.removeEventListener('loadedmetadata', () => {});
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [
    audioRef,
    currentSongIndex,
    isSeeking,
    isPlaying,
    repeatMode,
    songs,
    setCurrentTime,
    setTrackLength,
    setSeekProgress,
  ]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      if (playerTrackRef.current && albumArtRef.current) {
        t1.current.reverse();
        playerTrackRef.current.classList.remove('active');
        albumArtRef.current.classList.remove('active');
      }
    } else {
      audio.play().catch((err) => console.error('Play error:', err));
      setIsPlaying(true);
      if (playerTrackRef.current && albumArtRef.current) {
        t1.current.play();
        playerTrackRef.current.classList.add('active');
        albumArtRef.current.classList.add('active');
      }
    }
  };

  const handlePrevious = () => {
    const newIndex = currentSongIndex > 0 ? currentSongIndex - 1 : songs.length - 1;
    setCurrentSongIndex(newIndex);
    if (isPlaying && audioRef.current) {
      audioRef.current.load();
    }
  };

  const handleNext = () => {
    const newIndex = currentSongIndex < songs.length - 1 ? currentSongIndex + 1 : 0;
    setCurrentSongIndex(newIndex);
    if (isPlaying && audioRef.current) {
      audioRef.current.load();
    }
  };

  const handleRandom = () => {
    const newIndex = Math.floor(Math.random() * songs.length);
    setCurrentSongIndex(newIndex);
    if (isPlaying && audioRef.current) {
      audioRef.current.load();
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (audio && audio.duration && !isNaN(audio.duration)) {
      const seekPos = (parseFloat(e.target.value) / 100) * audio.duration;
      audio.currentTime = seekPos;
      setSeekProgress(parseFloat(e.target.value));
    }
  };

  const handleSongSelect = (index) => {
    setCurrentSongIndex(index);
    if (isPlaying && audioRef.current) {
      audioRef.current.load();
    }
  };

  const handleRepeat = () => {
    const modes = ['none', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  return {
    handlePlayPause,
    handlePrevious,
    handleNext,
    handleRandom,
    handleSeek,
    handleSongSelect,
    handleRepeat,
    handleSeekStart: () => setIsSeeking(true),
    handleSeekEnd: () => setIsSeeking(false),
  };
};