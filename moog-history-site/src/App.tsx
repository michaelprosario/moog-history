// App.tsx
import { useState } from 'react';
import { Header } from './components/Header';
import { ModularHome } from './components/ModularHome';
import { Showroom } from './components/Showroom';
import { InnovatorsGraph } from './components/InnovatorsGraph';
import { TimelineScroll } from './components/TimelineScroll';
import { RackPlayer } from './components/RackPlayer';
import { audioEngine } from './AudioEngine';
import './App.css';

function App() {
  const [currentTab, setTab] = useState('home');
  const [selectedSynth, setSelectedSynth] = useState('Minimoog Model D');
  const [selectedPerson, setSelectedPerson] = useState('');

  // Handle autocomplete search selections
  const handleSearchSelect = (type: 'synth' | 'person' | 'track', name: string) => {
    if (type === 'synth') {
      setSelectedSynth(name);
      setTab('synths');
    } else if (type === 'person') {
      setSelectedPerson(name);
      setTab('people');
    } else if (type === 'track') {
      // Start synthesizing the selected track instantly!
      audioEngine.playTrack(name);
    }
  };

  return (
    <div className="app-container">
      {/* Frosted Glass Sticky Header */}
      <Header 
        currentTab={currentTab} 
        setTab={setTab} 
        onSearchSelect={handleSearchSelect} 
      />

      {/* Main Viewport Content */}
      <main className="main-viewport">
        {currentTab === 'home' && (
          <ModularHome 
            setTab={setTab} 
            setSelectedPerson={setSelectedPerson}
            setSelectedSynth={setSelectedSynth}
          />
        )}
        
        {currentTab === 'synths' && (
          <Showroom 
            selectedSynthName={selectedSynth} 
            setSelectedSynthName={setSelectedSynth}
          />
        )}
        
        {currentTab === 'people' && (
          <InnovatorsGraph 
            selectedPersonName={selectedPerson} 
            setSelectedPersonName={setSelectedPerson} 
          />
        )}
        
        {currentTab === 'timeline' && (
          <TimelineScroll />
        )}
      </main>

      {/* Persistent Bottom Hardware Rack-Player with Oscilloscope */}
      <RackPlayer />
    </div>
  );
}

export default App;
