// Showroom.tsx
import React, { useState, useEffect, useRef } from 'react';
import { ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';
import { audioEngine, type SynthSettings } from '../AudioEngine';

interface ShowroomProps {
  selectedSynthName: string;
  setSelectedSynthName: (name: string) => void;
}

interface SynthData {
  name: string;
  year: number;
  type: string;
  era: string;
  chassis: string;
  keys: string;
  production: string;
  priceClass: string;
  description: string;
  techHighlight: string;
  specDetails: { [key: string]: string };
}

const SYNTHS_DATA: SynthData[] = [
  {
    name: 'Minimoog Model D',
    year: 1970,
    type: 'Monophonic Analog Synthesizer',
    era: 'Moog Music Buffalo / Norlin',
    chassis: 'Handcrafted Walnut Wood and Brushed Steel fascia',
    keys: '44-note Fatar Keybed',
    production: 'Asheville, NC, USA (Original & Reissues)',
    priceClass: 'Collector / High-End Premium',
    description: 'The archetype of the portable synthesizer. Distilled the power of massive modular systems into a road-worthy instrument that defined progressive rock, funk, and early disco.',
    techHighlight: 'Features the patented 4-pole 24dB/octave low-pass transistor ladder filter. Possesses three VCOs which could be detuned to create a massive, rich chorusing sound.',
    specDetails: {
      'Oscillators': '3 VCOs (VCO 3 can serve as LFO)',
      'Filter': '4-pole 24dB/Octave Low-pass Ladder Filter',
      'Envelope': '2 independent ADSD envelopes (Filter & Amp)',
      'Signal Path': '100% discrete transistors, fully analog',
      'Portability': 'Fold-up panel, solid wooden cabinet (28 lbs)'
    }
  },
  {
    name: 'Minimoog Voyager',
    year: 2002,
    type: 'Monophonic Analog Synthesizer',
    era: 'Moog Music Reborn',
    chassis: 'Handcrafted hardwood cabinet with backlit metal panel',
    keys: '44-note Velocity & Aftertouch Keyboard',
    production: 'Asheville, NC, USA',
    priceClass: 'Professional / High-End Studio',
    description: 'The first instrument released by Bob Moog after reacquiring his name. It modernized the classic Model D architecture with digital preset memories, MIDI capability, and touch control, whilst preserving the all-analog signal path.',
    techHighlight: 'Includes a central three-dimensional X/Y/A touch surface that maps finger position (horizontal, vertical) and contact area (pressure) to sound parameters.',
    specDetails: {
      'Oscillators': '3 ultra-stable analog VCOs with continuously variable waveshapes',
      'Filter': 'Dual Lowpass/Bandpass Ladder Filters (selectable)',
      'Control': 'Full MIDI integration, 896 programmable presets',
      'Modulation': '2 LFOs, complex modulation matrix',
      'Interface': 'Backlit visual panel, 3D pressure-sensitive Touch Pad'
    }
  },
  {
    name: 'Moog Muse',
    year: 2024,
    type: '8-Voice Polyphonic Analog Synthesizer',
    era: 'inMusic Era (Hybrid design)',
    chassis: 'Brushed metal fascia with industrial rubberized panels',
    keys: '61-note semi-weighted keybed with aftertouch',
    production: 'Asheville, NC, USA (Initial Run) / Taiwan',
    priceClass: 'High-End Flagship Poly',
    description: 'Bridges the vintage voice circuitry of the 1982 Memorymoog with modern digital modulation and powerful sequencing. Represents the flagship of Moog\'s modern polyphonic lineup.',
    techHighlight: 'Features an advanced 64-step sequencer and a custom "Stereo Diffusion Delay" section. Eric Frampton recreated 100 iconic presets from the Memorymoog to bridge eras.',
    specDetails: {
      'Voices': '8-voice bi-timbral polyphony',
      'Oscillators': '2 VCOs per voice plus triangle-core LFOs',
      'Filter': 'Dual classic Moog transistor ladder filters',
      'Sequencing': '64-step sequencer with parameter recording',
      'Memory': 'Over 500 factory presets including Memorymoog bank'
    }
  },
  {
    name: 'The Messenger',
    year: 2026,
    type: 'Monophonic Compact Synthesizer',
    era: 'inMusic Era (First full model)',
    chassis: 'Lightweight Plastic molded shell with metal faceplate overlay',
    keys: '32-note mini keybed (no velocity response)',
    production: 'Taiwan',
    priceClass: 'Entry-Level / Accessible',
    description: 'Developed fully under the inMusic stewardship, prioritizing portability and affordability. Departure from traditional wood-and-steel in favor of global mass production.',
    techHighlight: 'Introduces a digital wave-folding circuit alongside the analog signal path to expand the sonic palette. Has a Bass Compensation button to prevent low-end frequency loss at high resonance.',
    specDetails: {
      'Oscillators': '1 Analog VCO with digital modulation + wave folder',
      'Filter': 'Transistor Ladder filter with Bass Compensation mode',
      'Interface': 'Screenless, multi-function "Quick Assign" PGM button matrix',
      'Portability': 'Lightweight plastic shell (3.8 lbs), powered via USB-C'
    }
  },
  {
    name: 'Theremin',
    year: 1954,
    type: 'Touchless Electronic Instrument',
    era: 'R.A. Moog Co. Origins',
    chassis: 'Vintage wooden console cabinet or portable stand module',
    keys: 'None (Touchless electromagnetic antenna control)',
    production: 'Flushing, NY, USA (Early days)',
    priceClass: 'Historical Collector / Educational',
    description: 'Bob Moog\'s initial gateway into electronic design. A touchless musical instrument where the performer\'s hands modulate the electromagnetic field around two metal antennas to control pitch and volume.',
    techHighlight: 'Early tube-based Vanguard models led to the 1961 transistorized Melodia, laying the groundwork for the voltage-control systems that Bob Moog later standardized.',
    specDetails: {
      'Circuitry': 'Heterodyning oscillators (vacuum tubes transitioning to transistors)',
      'Antennas': 'Linear pitch antenna & loop volume antenna',
      'Frequency': 'Continuous pitch range based on hand proximity',
      'Legacy': 'Inducted into the TECnology Hall of Fame in 2005'
    }
  }
];

export const Showroom: React.FC<ShowroomProps> = ({ 
  selectedSynthName, 
  setSelectedSynthName 
}) => {
  const [synthSettings, setSynthSettings] = useState<SynthSettings>(audioEngine.getSettings());
  const [knobDragging, setKnobDragging] = useState(false);
  const startYRef = useRef<number>(0);
  const startCutoffRef = useRef<number>(1500);

  const activeSynth = SYNTHS_DATA.find(s => s.name === selectedSynthName) || SYNTHS_DATA[0];

  useEffect(() => {
    // Keep local settings in sync with global audioEngine
    setSynthSettings(audioEngine.getSettings());
    
    audioEngine.onStateChange = (newSettings) => {
      setSynthSettings(newSettings);
    };
  }, []);

  // Update selected synth profile
  const handleSelectSynth = (name: string) => {
    audioEngine.playInterfaceClick(250);
    setSelectedSynthName(name);

    // Apply baseline settings depending on chosen synth
    if (name === 'The Messenger') {
      audioEngine.updateSettings({ bassCompensation: true, revision: 'rev3' });
    } else if (name === 'Minimoog Model D') {
      audioEngine.updateSettings({ revision: 'rev1' }); // classic pitch drift!
    } else {
      audioEngine.updateSettings({ revision: 'rev3' });
    }
  };

  // Keyboard notes mapping for playable piano keys
  const PIANO_KEYS = [
    { label: 'C', note: 'C3', color: 'white' },
    { label: 'C#', note: 'C#3', color: 'black' },
    { label: 'D', note: 'D3', color: 'white' },
    { label: 'D#', note: 'D#3', color: 'black' },
    { label: 'E', note: 'E3', color: 'white' },
    { label: 'F', note: 'F3', color: 'white' },
    { label: 'F#', note: 'F#3', color: 'black' },
    { label: 'G', note: 'G3', color: 'white' },
    { label: 'G#', note: 'G#3', color: 'black' },
    { label: 'A', note: 'A3', color: 'white' },
    { label: 'A#', note: 'A#3', color: 'black' },
    { label: 'B', note: 'B3', color: 'white' },
    { label: 'C', note: 'C4', color: 'white' }
  ];

  const playNote = (noteName: string) => {
    audioEngine.triggerNote(noteName, 0.4);
  };

  // Drag-to-adjust knob logic for cutoff filter
  const handleKnobMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setKnobDragging(true);
    startYRef.current = e.clientY;
    startCutoffRef.current = synthSettings.cutoff;
    document.body.style.cursor = 'grabbing';
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!knobDragging) return;
      const deltaY = startYRef.current - e.clientY; // upward drag increases frequency
      
      // Calculate new cutoff: map delta Y to a logarithmic range
      // Range: 80Hz to 6000Hz
      const minCutoff = 80;
      const maxCutoff = 6000;
      
      // Scale multiplier
      const scale = 5;
      let newCutoff = startCutoffRef.current + deltaY * scale;
      newCutoff = Math.max(minCutoff, Math.min(maxCutoff, newCutoff));
      
      // Play retro plastic click at bounds
      if ((newCutoff === minCutoff && synthSettings.cutoff > minCutoff) || 
          (newCutoff === maxCutoff && synthSettings.cutoff < maxCutoff)) {
        audioEngine.playInterfaceClick(100);
      }
      
      audioEngine.updateSettings({ cutoff: Math.round(newCutoff) });
    };

    const handleMouseUp = () => {
      if (knobDragging) {
        setKnobDragging(false);
        document.body.style.cursor = '';
      }
    };

    if (knobDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [knobDragging, synthSettings.cutoff]);

  // Map cutoff to angle (approx -135deg to +135deg)
  const calculateKnobAngle = () => {
    const minC = 80;
    const maxC = 6000;
    const ratio = (synthSettings.cutoff - minC) / (maxC - minC);
    return -135 + ratio * 270;
  };

  return (
    <div className="showroom-container">
      {/* Sidebar Selector */}
      <div className="showroom-sidebar">
        <h3>SYNTH SELECTION</h3>
        <div className="sidebar-links">
          {SYNTHS_DATA.map((synth, idx) => (
            <button
              key={idx}
              className={`sidebar-synth-btn ${activeSynth.name === synth.name ? 'active' : ''}`}
              onClick={() => handleSelectSynth(synth.name)}
            >
              <span>{synth.name}</span>
              <span className="synth-btn-year">{synth.year}</span>
            </button>
          ))}
        </div>

        {/* Playable Keyboard Soundboard */}
        <div className="soundboard-module">
          <div className="module-title">VCO TEST CONTROLS</div>
          <p className="control-help">Test waves and filters by clicking the keybed keys:</p>
          
          <div className="synth-keybed">
            {PIANO_KEYS.map((key, idx) => (
              <div
                key={idx}
                className={`synth-key ${key.color}-key`}
                onClick={() => playNote(key.note)}
                title={`Trigger ${key.note}`}
              >
                <span className="key-note-label">{key.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Specs Dashboard */}
      <div className="showroom-dashboard">
        
        {/* Left Column: Interactive Panel & VCO Waveform Selector */}
        <div className="dashboard-left-column">
          <div className="hardware-panel-faceplate">
            <div className="faceplate-screw top-left"></div>
            <div className="faceplate-screw top-right"></div>
            <div className="faceplate-screw bottom-left"></div>
            <div className="faceplate-screw bottom-right"></div>

            <div className="faceplate-header">
              <span className="brand-logo">MOOG LABORATORY</span>
              <span className="module-tag">VCF LADDER & WAVE GENERATOR</span>
            </div>

            {/* Interactive Cutoff Knob */}
            <div className="cutoff-knob-section">
              <div className="knob-assembly">
                <div 
                  className="physical-knob"
                  style={{ transform: `rotate(${calculateKnobAngle()}deg)` }}
                  onMouseDown={handleKnobMouseDown}
                >
                  <div className="knob-marker-line"></div>
                </div>
                <div className="knob-tick-scale">
                  <span className="tick-val min">MIN</span>
                  <span className="tick-val center">LADDER</span>
                  <span className="tick-val max">MAX</span>
                </div>
              </div>
              <div className="knob-label-data">
                <span className="knob-title">CUTOFF FREQUENCY</span>
                <span className="knob-value">{synthSettings.cutoff} Hz</span>
              </div>
            </div>

            {/* Waveform Selector */}
            <div className="waveform-selection-rack">
              <div className="rack-title">VCO WAVEFORM SELECTOR</div>
              <div className="waveform-grid">
                {(['triangle', 'sawtooth', 'square', 'sharktooth'] as const).map((w, idx) => (
                  <button
                    key={idx}
                    className={`wave-btn ${synthSettings.waveform === w ? 'active' : ''}`}
                    onClick={() => {
                      audioEngine.playInterfaceClick(300);
                      audioEngine.updateSettings({ waveform: w });
                    }}
                  >
                    <div className="wave-icon-box">
                      {w === 'triangle' && (
                        <svg viewBox="0 0 40 20" width="30" height="15" stroke="currentColor" fill="none" strokeWidth="2.5">
                          <path d="M 0 10 L 10 2 L 20 18 L 30 2 L 40 10" />
                        </svg>
                      )}
                      {w === 'sawtooth' && (
                        <svg viewBox="0 0 40 20" width="30" height="15" stroke="currentColor" fill="none" strokeWidth="2.5">
                          <path d="M 0 18 L 20 2 L 20 18 L 40 2" />
                        </svg>
                      )}
                      {w === 'square' && (
                        <svg viewBox="0 0 40 20" width="30" height="15" stroke="currentColor" fill="none" strokeWidth="2.5">
                          <path d="M 0 18 L 0 2 L 18 2 L 18 18 L 36 18 L 36 2 L 40 2" />
                        </svg>
                      )}
                      {w === 'sharktooth' && (
                        <svg viewBox="0 0 40 20" width="30" height="15" stroke="currentColor" fill="none" strokeWidth="2.5">
                          <path d="M 0 18 Q 8 18 10 2 Q 10 18 20 18 Q 28 18 30 2 Q 30 18 40 18" />
                        </svg>
                      )}
                    </div>
                    <span className="wave-label-text">{w.toUpperCase()}</span>
                  </button>
                ))}
              </div>
              <p className="wave-description-sub">
                {synthSettings.waveform === 'sharktooth' && "Early discrete transistor core output prior to waveshaping. Rich, raw, and asymmetric."}
                {synthSettings.waveform === 'triangle' && "Soft, low harmonic content. Ideal for sub-bass foundations and warm thuds."}
                {synthSettings.waveform === 'sawtooth' && "Maximum harmonic richness. The gold standard for aggressive, biting Moog leads."}
                {synthSettings.waveform === 'square' && "Hollow, woodwind-like character. Used for percussive textures and sync sequences."}
              </p>
            </div>

            {/* Resonance Slider */}
            <div className="resonance-slider-block">
              <div className="slider-labels">
                <span>FILTER RESONANCE (Q)</span>
                <span className="val">{synthSettings.resonance.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="15"
                step="0.2"
                value={synthSettings.resonance}
                onChange={(e) => audioEngine.updateSettings({ resonance: parseFloat(e.target.value) })}
                className="resonance-range-fader"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Historical & Technical Details */}
        <div className="dashboard-right-column">
          <div className="info-title-group">
            <h2>{activeSynth.name}</h2>
            <div className="era-badge">{activeSynth.type} — {activeSynth.year}</div>
          </div>

          <p className="synth-paragraph-desc">{activeSynth.description}</p>

          {/* Interactive Hardware Spec Comparison Card */}
          <div className="spec-table-card">
            <h4>TECHNICAL ARCHITECTURE</h4>
            <div className="spec-table-grid">
              {Object.entries(activeSynth.specDetails).map(([key, val], idx) => (
                <div key={idx} className="spec-row">
                  <span className="spec-key">{key}</span>
                  <span className="spec-value">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Highlight Section */}
          <div className="highlight-callout-box">
            <Sparkles size={16} className="text-amber" />
            <div className="callout-content">
              <strong>DESIGN DYNAMICS:</strong>
              <p>{activeSynth.techHighlight}</p>
            </div>
          </div>

          {/* Filter Stability & Revision Selection Toggles */}
          <div className="showroom-calibration-panel">
            <h4>CIRCUIT CALIBRATION SYSTEMS</h4>

            <div className="cal-toggles-grid">
              {/* Bass Compensation Option (Messenger focus) */}
              <div className="cal-card">
                <div className="cal-card-header">
                  <strong>Bass Compensation</strong>
                  <button 
                    className="cal-toggle-icon"
                    onClick={() => {
                      audioEngine.playInterfaceClick(200);
                      audioEngine.updateSettings({ bassCompensation: !synthSettings.bassCompensation });
                    }}
                  >
                    {synthSettings.bassCompensation ? (
                      <ToggleRight size={28} className="text-green" />
                    ) : (
                      <ToggleLeft size={28} className="text-muted" />
                    )}
                  </button>
                </div>
                <p className="cal-card-text">
                  Counteracts low-end frequency loss when filter resonance increases. Tying the low shelf gain to the resonance coefficient prevents signal thinning.
                </p>
                <div className="cal-source-badge">Introduced on the Moog Messenger (2025)</div>
              </div>

              {/* Minimoog Model D Circuit Revision Toggle */}
              <div className="cal-card">
                <div className="cal-card-header">
                  <strong>VCO Circuit Revision</strong>
                  <div className="revision-selectors">
                    {(['rev1', 'rev2', 'rev3'] as const).map((rev, idx) => (
                      <button
                        key={idx}
                        className={`rev-pill ${synthSettings.revision === rev ? 'active' : ''}`}
                        onClick={() => {
                          audioEngine.playInterfaceClick(200);
                          audioEngine.updateSettings({ revision: rev });
                        }}
                      >
                        {rev.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="cal-card-text">
                  {synthSettings.revision === 'rev1' && "Rev 1: Fully discrete transistor core. Highly prized for warm, slow oscillator phase beating, but subject to heavy temperature drift."}
                  {synthSettings.revision === 'rev2' && "Rev 2: Employs matching CA3046 arrays for improved scaling consistency."}
                  {synthSettings.revision === 'rev3' && "Rev 3: Integrated UA726 op-amps for temperature stability. Prevents pitch drift, but reduces phase detuning."}
                </p>
                <div className="cal-source-badge">Model D Revisions (1971-1981)</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
