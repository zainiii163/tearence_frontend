import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMarketplaceBooks, setFilters, purchaseBook, downloadBookPDF } from '../../slice/BookMarketplaceSlice';
import {
  FaHeadphones,
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
  FaCompress,
  FaDownload,
  FaShoppingCart,
  FaHeart,
  FaShareAlt,
  FaClock,
  FaUser,
  FaDollarSign,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const AudiobookSection = () => {
  const dispatch = useDispatch();
  const { books, loading, purchasing, downloading, filters } = useSelector((state) => state.bookMarketplace);
  
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showPlayer, setShowPlayer] = useState(false);
  const [selectedAudiobook, setSelectedAudiobook] = useState(null);

  useEffect(() => {
    // Fetch only audiobooks
    dispatch(fetchMarketplaceBooks({
      book_type: 'audiobook',
      page: 1,
      per_page: 12,
    }));
  }, [dispatch]);

  useEffect(() => {
    if (currentAudio) {
      const audio = currentAudio;
      
      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setDuration(audio.duration);
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', updateDuration);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', updateDuration);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [currentAudio]);

  const handlePlayPause = () => {
    if (currentAudio) {
      if (isPlaying) {
        currentAudio.pause();
      } else {
        currentAudio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    if (currentAudio) {
      currentAudio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    if (currentAudio) {
      currentAudio.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (currentAudio) {
      if (isMuted) {
        currentAudio.volume = volume;
        setIsMuted(false);
      } else {
        currentAudio.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const handleSpeedChange = (speed) => {
    if (currentAudio) {
      currentAudio.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
  };

  const playAudiobook = (audiobook) => {
    if (currentAudio) {
      currentAudio.pause();
    }

    if (audiobook.is_purchased && audiobook.audio_file) {
      const audio = new Audio(audiobook.audio_file);
      audio.playbackRate = playbackSpeed;
      audio.volume = volume;
      
      setCurrentAudio(audio);
      setSelectedAudiobook(audiobook);
      setShowPlayer(true);
      setIsPlaying(true);
      
      audio.play().catch(error => {
        toast.error('Failed to play audiobook');
        console.error('Audio play error:', error);
      });
    } else {
      // Purchase the audiobook first
      handlePurchase(audiobook);
    }
  };

  const handlePurchase = async (audiobook) => {
    try {
      await dispatch(purchaseBook(audiobook.book_id)).unwrap();
      toast.success('Audiobook purchased successfully! You can now listen to it.');
      // Refresh the books to update purchase status
      dispatch(fetchMarketplaceBooks({
        book_type: 'audiobook',
        page: 1,
        per_page: 12,
      }));
    } catch (error) {
      toast.error(error.message || 'Failed to purchase audiobook');
    }
  };

  const handleDownload = async (audiobook) => {
    try {
      await dispatch(downloadBookPDF(audiobook.book_id)).unwrap();
      toast.success('Download started successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to download audiobook');
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const audiobooks = books.filter(book => book.book_type === 'audiobook');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <FaHeadphones className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Audiobook Collection
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Immerse yourself in our curated collection of audiobooks. Listen to bestsellers, 
            educational content, and more on any device.
          </p>
        </div>

        {/* Audio Player (shown when audiobook is selected) */}
        {showPlayer && selectedAudiobook && (
          <div className={`fixed ${isFullscreen ? 'inset-0 z-50' : 'bottom-0 left-0 right-0 z-40'} bg-white border-t shadow-lg transition-all duration-300`}>
            <div className={`${isFullscreen ? 'h-screen flex flex-col justify-center' : 'p-4'}`}>
              {/* Fullscreen toggle */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  {isFullscreen ? <FaCompress /> : <FaExpand />}
                </button>
              </div>

              {/* Audiobook Info */}
              <div className={`${isFullscreen ? 'text-center mb-8' : 'mb-4'}`}>
                <h3 className={`font-semibold text-foreground ${isFullscreen ? 'text-2xl' : 'text-lg'}`}>
                  {selectedAudiobook.title}
                </h3>
                <p className={`text-muted-foreground ${isFullscreen ? 'text-lg' : 'text-sm'}`}>
                  by {selectedAudiobook.author}
                </p>
                {selectedAudiobook.audiobook_duration && (
                  <p className="text-sm text-muted-foreground flex items-center gap-2 justify-center mt-2">
                    <FaClock />
                    Duration: {selectedAudiobook.audiobook_duration}
                  </p>
                )}
              </div>

              {/* Audio Controls */}
              <div className={`${isFullscreen ? 'max-w-2xl mx-auto' : ''}`}>
                {/* Progress Bar */}
                <div className="mb-4">
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Main Controls */}
                <div className="flex items-center justify-center gap-4 mb-4">
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <FaStepBackward />
                  </button>
                  <button
                    onClick={handlePlayPause}
                    className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                  >
                    {isPlaying ? <FaPause /> : <FaPlay />}
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <FaStepForward />
                  </button>
                </div>

                {/* Volume and Speed Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button onClick={toggleMute} className="p-2 rounded-full hover:bg-gray-100">
                      {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Speed:</span>
                    <select
                      value={playbackSpeed}
                      onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="0.5">0.5x</option>
                      <option value="0.75">0.75x</option>
                      <option value="1">1x</option>
                      <option value="1.25">1.25x</option>
                      <option value="1.5">1.5x</option>
                      <option value="2">2x</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Audiobooks Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
            {audiobooks.map((audiobook) => (
              <div
                key={audiobook.book_id}
                className="group rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-t-lg bg-muted relative">
                  <img
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    src={audiobook.cover_image || '/img/NoImage.png'}
                    alt={audiobook.title}
                    onError={(e) => {
                      e.target.src = '/img/NoImage.png';
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <FaHeadphones className="h-3 w-3" />
                    Audiobook
                  </div>
                  {audiobook.is_purchased && (
                    <div className="absolute top-2 left-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      Owned
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {audiobook.genre || 'General'}
                    </span>
                    {audiobook.audiobook_duration && (
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full flex items-center gap-1">
                        <FaClock className="h-3 w-3" />
                        {audiobook.audiobook_duration}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold leading-tight text-foreground line-clamp-2 mb-2">
                    {audiobook.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-1">
                    by {audiobook.author}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {audiobook.short_description || audiobook.description?.substring(0, 100) + '...'}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-lg font-semibold text-primary">
                      <FaDollarSign className="h-4 w-4" />
                      {audiobook.price}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {audiobook.is_purchased ? (
                      <>
                        <button
                          onClick={() => playAudiobook(audiobook)}
                          className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 h-9 px-3 text-sm font-medium transition-colors"
                        >
                          <FaPlay className="h-3 w-3" />
                          Play Now
                        </button>
                        <button
                          onClick={() => handleDownload(audiobook)}
                          disabled={downloading}
                          className="inline-flex items-center justify-center gap-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 h-9 px-3 text-sm font-medium transition-colors"
                        >
                          <FaDownload className="h-3 w-3" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handlePurchase(audiobook)}
                        disabled={purchasing}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 h-9 px-3 text-sm font-medium transition-colors"
                      >
                        <FaShoppingCart className="h-3 w-3" />
                        {purchasing ? 'Purchasing...' : 'Purchase'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && audiobooks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <FaHeadphones className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">No audiobooks found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Check back soon for new audiobook additions to our collection.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudiobookSection;
