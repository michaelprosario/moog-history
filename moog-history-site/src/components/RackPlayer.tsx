// RackPlayer.tsx
import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music, Volume2 } from 'lucide-react';
import { audioEngine, TRACKS, type Track } from '../AudioEngine';
import { Oscilloscope } from './Oscilloscope';

export const RackPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [volume, setVolume] = useState(0.7);
  const [showPlaylist, setShowPlaylist] = useState(false);

  useEffect(() => {
    // Sync initially
    const track = audioEngine.getPlayingTrack();
    setCurrentTrack(track);
    setIsPlaying(!!track);

    // Register callback for sequencer states
    audioEngine.onTrackPlaying = (trackName, playing) => {
      setIsPlaying(playing);
      const active = TRACKS.find(t => t.name === trackName) || null;
      setCurrentTrack(active);
    };

    // Load initial volume settings
    const settings = audioEngine.getSettings();
    setVolume(settings.volume);
  }, []);

  const handlePlayPause = () => {
    audioEngine.playInterfaceClick(350);
    if (isPlaying) {
      audioEngine.stopSequencer();
    } else {
      // Play current track or default to Wendy Carlos
      const trackName = currentTrack ? currentTrack.name : TRACKS[0].name;
      audioEngine.playTrack(trackName);
    }
  };

  const handleSelectTrack = (track: Track) => {
    audioEngine.playInterfaceClick(400);
    audioEngine.playTrack(track.name);
    setShowPlaylist(false);
  };

  const handleNext = () => {
    audioEngine.playInterfaceClick(300);
    const currentIndex = currentTrack ? TRACKS.findIndex(t => t.name === currentTrack.name) : 0;
    const nextIndex = (currentIndex + 1) % TRACKS.length;
    audioEngine.playTrack(TRACKS[nextIndex].name);
  };

  const handlePrev = () => {
    audioEngine.playInterfaceClick(300);
    const currentIndex = currentTrack ? TRACKS.findIndex(t => t.name === currentTrack.name) : TRACKS.length - 1;
    const prevIndex = (currentIndex - 1 + TRACKS.length) % TRACKS.length;
    audioEngine.playTrack(TRACKS[prevIndex].name);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioEngine.updateSettings({ volume: newVolume });
  };

  return (
    <footer className="rack-player-footer">
      {/* Decorative Left Rack-mount Handles */}
      <div className="player-handle-left"></div>

      <div className="player-inner-grid">
        
        {/* Track Details & Oscilloscope */}
        <div className="player-meta-section">
          <div className="oscilloscope-container">
            <Oscilloscope color="#00FF66" height={45} />
          </div>
          
          <div className="track-details">
            {currentTrack ? (
              <>
                <span className="current-track-name">{currentTrack.name}</span>
                <span className="current-track-artist">{currentTrack.artist} — {currentTrack.album} ({currentTrack.year})</span>
              </>
            ) : (
              <>
                <span className="current-track-name">SYSTEM STANDBY</span>
                <span className="current-track-artist">Select a track to synthesize analog sequences</span>
              </>
            )}
          </div>
        </div>

        {/* Transport Controls */}
        <div className="player-transport">
          <button className="transport-btn" onClick={handlePrev} title="Previous Track">
            <SkipBack size={16} />
          </button>
          
          <button 
            className={`transport-btn play-pause-btn ${isPlaying ? 'playing' : ''}`}
            onClick={handlePlayPause}
            title={isPlaying ? "Pause Sequence" : "Play Sequence"}
          >
            {isPlaying ? <Pause size={20} fill="#080808" /> : <Play size={20} fill="#080808" />}
          </button>

          <button className="transport-btn" onClick={handleNext} title="Next Track">
            <SkipForward size={16} />
          </button>
        </div>

        {/* Volume Slider & Playlist Drawer Button */}
        <div className="player-utilities">
          
          {/* Volume Control */}
          <div className="volume-control-wrapper">
            <Volume2 size={16} className="text-muted" />
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
          </div>

          {/* Playlist selector */}
          <div className="playlist-selector-wrapper">
            <button 
              className={`playlist-drawer-btn ${showPlaylist ? 'active' : ''}`}
              onClick={() => {
                audioEngine.playInterfaceClick(200);
                setShowPlaylist(!showPlaylist);
              }}
            >
              <Music size={16} />
              <span>SEQUENCER SELECT</span>
            </button>

            {showPlaylist && (
              <div className="playlist-dropdown">
                <div className="dropdown-header">AVAILABLE SYNTHESIZES SEQUENCES</div>
                {TRACKS.map((track, idx) => (
                  <button 
                    key={idx}
                    className={`playlist-item ${currentTrack?.name === track.name ? 'playing' : ''}`}
                    onClick={() => handleSelectTrack(track)}
                  >
                    <div className="item-playback-indicator">
                      {currentTrack?.name === track.name && isPlaying ? (
                        <span className="playing-pulse-dot"></span>
                      ) : (
                        <span className="static-dot"></span>
                      )}
                    </div>
                    <div className="item-meta">
                      <span className="item-name">{track.name}</span>
                      <span className="item-artist">{track.artist}</span>
                    </div>
                    <span className="item-year">{track.year}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Decorative Right Rack-mount Handles */}
      <div className="player-handle-right"></div>
    </footer>
  );
};
