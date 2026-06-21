// Header.tsx
import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Search } from 'lucide-react';
import { audioEngine, type SynthSettings } from '../AudioEngine';

interface HeaderProps {
  currentTab: string;
  setTab: (tab: string) => void;
  onSearchSelect: (type: 'synth' | 'person' | 'track', name: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setTab, onSearchSelect }) => {
  const [audioSettings, setAudioSettings] = useState<SynthSettings>(audioEngine.getSettings());
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<{ type: 'synth' | 'person' | 'track'; name: string; context: string }[]>([]);

  useEffect(() => {
    audioEngine.onStateChange = (settings) => {
      setAudioSettings(settings);
    };
  }, []);

  const toggleMute = () => {
    audioEngine.playInterfaceClick(200);
    audioEngine.updateSettings({ isMuted: !audioSettings.isMuted });
  };

  // Perform a lookup across the Moog data
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const items = [
      // Synths
      { type: 'synth' as const, name: 'Minimoog Model D', context: 'Portable Analog Synthesizer (1970)' },
      { type: 'synth' as const, name: 'Minimoog Voyager', context: 'Modern Analog Classic (2002)' },
      { type: 'synth' as const, name: 'Moog Muse', context: '8-Voice Polyphonic Analog (2024)' },
      { type: 'synth' as const, name: 'The Messenger', context: 'New Era inMusic Monosynth (2025/2026)' },
      { type: 'synth' as const, name: 'Theremin', context: 'Bob Moog\'s Early Touchless Instrument (1954)' },
      { type: 'synth' as const, name: 'Modular Systems', context: 'Gargantuan Cabinet Rigs (1960s)' },
      
      // People
      { type: 'person' as const, name: 'Dr. Robert "Bob" Moog', context: 'Inventor & Founder' },
      { type: 'person' as const, name: 'Wendy Carlos', context: 'Switched-On Bach Classical Catalyst' },
      { type: 'person' as const, name: 'Bernie Worrell', context: 'Parliament Funk Bass Legend' },
      { type: 'person' as const, name: 'Keith Emerson', context: 'ELP Prog-Rock Monster Moog Lead' },
      { type: 'person' as const, name: 'Rick Wakeman', context: 'Yes Keyboard Wizard' },
      { type: 'person' as const, name: 'Herb Deutsch', context: 'Co-developer & Collaborative Catalyst' },
      { type: 'person' as const, name: 'Don Martin', context: 'Cincinnati Trademark Vagabond' },
      { type: 'person' as const, name: 'Alex Winter', context: 'UK Welsh Model 204E Synthesizer creator' },
      
      // Tracks
      { type: 'track' as const, name: 'Switched-On Bach', context: 'Wendy Carlos (1968) Bach Sinfonia' },
      { type: 'track' as const, name: 'Flash Light', context: 'Parliament (1977) Bernie Worrell Bassline' },
      { type: 'track' as const, name: 'Autobahn', context: 'Kraftwerk (1974) Minimalist Electronic Sequence' },
      { type: 'track' as const, name: 'Cars', context: 'Gary Numan (1979) Synth-Pop Anthem' },
      { type: 'track' as const, name: 'I Feel Love', context: 'Giorgio Moroder (1977) Disco sequence' }
    ];

    const filtered = items.filter(
      item => item.name.toLowerCase().includes(query.toLowerCase()) || 
              item.context.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(filtered);
  };

  const handleSelectResult = (result: { type: 'synth' | 'person' | 'track'; name: string }) => {
    audioEngine.playInterfaceClick(440);
    onSearchSelect(result.type, result.name);
    setSearchQuery('');
    setShowResults(false);
  };

  const handleTabClick = (tab: string) => {
    audioEngine.playInterfaceClick(150);
    setTab(tab);
  };

  return (
    <header className="site-header">
      <div className="header-container">
        {/* Retro Logo */}
        <div className="logo-container" onClick={() => handleTabClick('home')}>
          <svg className="moog-logo-svg" viewBox="0 0 160 40" width="130" height="32">
            <text x="5" y="30" className="logo-text-back">MOOG</text>
            <text x="5" y="30" className="logo-text-glow">MOOG</text>
          </svg>
          <span className="logo-subtext">ARCHIVE & SYNTH</span>
        </div>

        {/* Global Navigation Links */}
        <nav className="nav-menu">
          <button 
            className={`nav-link ${currentTab === 'home' ? 'active' : ''}`}
            onClick={() => handleTabClick('home')}
          >
            HOME
          </button>
          <button 
            className={`nav-link ${currentTab === 'synths' ? 'active' : ''}`}
            onClick={() => handleTabClick('synths')}
          >
            SYNTHS
          </button>
          <button 
            className={`nav-link ${currentTab === 'people' ? 'active' : ''}`}
            onClick={() => handleTabClick('people')}
          >
            PEOPLE
          </button>
          <button 
            className={`nav-link ${currentTab === 'timeline' ? 'active' : ''}`}
            onClick={() => handleTabClick('timeline')}
          >
            TIMELINE
          </button>
        </nav>

        {/* Search & Audio Controller */}
        <div className="header-controls">
          <div className="search-wrapper">
            <div className="search-bar">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search Synths, Artists, Tracks..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setShowResults(true)}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
              />
            </div>
            
            {showResults && searchResults.length > 0 && (
              <div className="search-results-dropdown">
                {searchResults.map((result, idx) => (
                  <div 
                    key={idx} 
                    className="search-result-item"
                    onClick={() => handleSelectResult(result)}
                  >
                    <div className="result-type-tag" data-type={result.type}>
                      {result.type.toUpperCase()}
                    </div>
                    <div className="result-info">
                      <div className="result-name">{result.name}</div>
                      <div className="result-context">{result.context}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button 
            className={`mute-toggle-btn ${audioSettings.isMuted ? 'muted' : 'unmuted'}`}
            onClick={toggleMute}
            title={audioSettings.isMuted ? "Unmute Audio" : "Mute Audio"}
          >
            {audioSettings.isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            <span className="mute-status-led"></span>
          </button>
        </div>
      </div>
    </header>
  );
};
