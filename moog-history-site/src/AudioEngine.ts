// AudioEngine.ts
// Real-time Web Audio API Synthesizer and Sequencer for Moog History Site

export interface SynthSettings {
  waveform: 'triangle' | 'sawtooth' | 'square' | 'sharktooth';
  cutoff: number; // 20 to 10000 Hz
  resonance: number; // 0 to 20
  bassCompensation: boolean;
  revision: 'rev1' | 'rev2' | 'rev3'; // rev1 (high drift), rev2 (medium), rev3 (stable)
  isMuted: boolean;
  volume: number; // 0 to 1
}

export interface Track {
  name: string;
  artist: string;
  album: string;
  year: number;
  notes: { note: string; duration: number; time: number }[];
  tempo: number;
}

// Convert note names to frequencies
const NOTE_FREQS: { [key: string]: number } = {
  // Octave 1
  'C1': 32.70, 'C#1': 34.65, 'D1': 36.71, 'D#1': 38.89, 'E1': 41.20, 'F1': 43.65, 'F#1': 46.25, 'G1': 49.00, 'G#1': 51.91, 'A1': 55.00, 'A#1': 58.27, 'B1': 61.74,
  // Octave 2
  'C2': 65.41, 'C#2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'E2': 82.41, 'F2': 87.31, 'F#2': 92.50, 'G2': 98.00, 'G#2': 103.83, 'A2': 110.00, 'A#2': 116.54, 'B2': 123.47,
  // Octave 3
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
  // Octave 4
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
  // Octave 5
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77,
  // Octave 6
  'C6': 1046.50, 'E6': 1318.51, 'G6': 1567.98
};

// Playlists defined using note patterns
export const TRACKS: Track[] = [
  {
    name: 'Switched-On Bach',
    artist: 'Wendy Carlos',
    album: 'Switched-On Bach',
    year: 1968,
    tempo: 105,
    notes: [
      // Sinfonia to Cantata No. 29 arpeggios/leads
      { note: 'D4', duration: 0.25, time: 0 },
      { note: 'F#4', duration: 0.25, time: 0.25 },
      { note: 'A4', duration: 0.25, time: 0.5 },
      { note: 'D5', duration: 0.25, time: 0.75 },
      { note: 'F#5', duration: 0.25, time: 1.0 },
      { note: 'A4', duration: 0.25, time: 1.25 },
      { note: 'D5', duration: 0.25, time: 1.5 },
      { note: 'F#5', duration: 0.25, time: 1.75 },
      { note: 'A5', duration: 0.5, time: 2.0 },
      { note: 'G5', duration: 0.25, time: 2.5 },
      { note: 'F#5', duration: 0.25, time: 2.75 },
      { note: 'E5', duration: 0.25, time: 3.0 },
      { note: 'D5', duration: 0.25, time: 3.25 },
      { note: 'C#5', duration: 0.25, time: 3.5 },
      { note: 'B4', duration: 0.25, time: 3.75 },
      { note: 'A4', duration: 0.5, time: 4.0 },
      // part 2
      { note: 'E4', duration: 0.25, time: 4.5 },
      { note: 'G4', duration: 0.25, time: 4.75 },
      { note: 'B4', duration: 0.25, time: 5.0 },
      { note: 'E5', duration: 0.25, time: 5.25 },
      { note: 'G5', duration: 0.25, time: 5.5 },
      { note: 'B4', duration: 0.25, time: 5.75 },
      { note: 'E5', duration: 0.25, time: 6.0 },
      { note: 'G5', duration: 0.25, time: 6.25 },
      { note: 'B5', duration: 0.5, time: 6.5 },
      { note: 'A5', duration: 0.25, time: 7.0 },
      { note: 'G5', duration: 0.25, time: 7.25 },
      { note: 'F#5', duration: 0.25, time: 7.5 },
      { note: 'E5', duration: 0.25, time: 7.75 },
      { note: 'D#5', duration: 0.25, time: 8.0 },
      { note: 'C#5', duration: 0.25, time: 8.25 },
      { note: 'B4', duration: 0.5, time: 8.5 }
    ]
  },
  {
    name: 'Flash Light',
    artist: 'Bernie Worrell (P-Funk)',
    album: 'Funkentelechy Vs. the Placebo Syndrome',
    year: 1977,
    tempo: 106,
    notes: [
      // Iconic Minimoog bassline
      { note: 'D#2', duration: 0.25, time: 0 },
      { note: 'D#2', duration: 0.15, time: 0.35 },
      { note: 'F#2', duration: 0.2, time: 0.6 },
      { note: 'G#2', duration: 0.2, time: 0.8 },
      { note: 'A#2', duration: 0.3, time: 1.0 },
      { note: 'B2', duration: 0.2, time: 1.4 },
      { note: 'A#2', duration: 0.2, time: 1.6 },
      { note: 'G#2', duration: 0.3, time: 1.8 },
      
      { note: 'D#2', duration: 0.25, time: 2.2 },
      { note: 'D#2', duration: 0.15, time: 2.5 },
      { note: 'F#2', duration: 0.2, time: 2.8 },
      { note: 'G#2', duration: 0.2, time: 3.0 },
      { note: 'A#2', duration: 0.3, time: 3.2 },
      { note: 'C#3', duration: 0.2, time: 3.6 },
      { note: 'B2', duration: 0.2, time: 3.8 },
      { note: 'A#2', duration: 0.3, time: 4.0 },
      
      { note: 'G#2', duration: 0.25, time: 4.4 },
      { note: 'G#2', duration: 0.15, time: 4.7 },
      { note: 'B2', duration: 0.2, time: 5.0 },
      { note: 'C#3', duration: 0.2, time: 5.2 },
      { note: 'D#3', duration: 0.3, time: 5.4 },
      { note: 'E3', duration: 0.2, time: 5.8 },
      { note: 'D#3', duration: 0.2, time: 6.0 },
      { note: 'C#3', duration: 0.3, time: 6.2 },
      
      { note: 'D#2', duration: 0.4, time: 6.6 },
      { note: 'F#2', duration: 0.2, time: 7.2 },
      { note: 'G#2', duration: 0.2, time: 7.4 },
      { note: 'A#2', duration: 0.4, time: 7.6 }
    ]
  },
  {
    name: 'Autobahn',
    artist: 'Kraftwerk',
    album: 'Autobahn',
    year: 1974,
    tempo: 112,
    notes: [
      // Minimalist sequence
      { note: 'F2', duration: 0.2, time: 0 },
      { note: 'F3', duration: 0.2, time: 0.25 },
      { note: 'F2', duration: 0.2, time: 0.5 },
      { note: 'F3', duration: 0.2, time: 0.75 },
      { note: 'Bb2', duration: 0.2, time: 1.0 },
      { note: 'Bb3', duration: 0.2, time: 1.25 },
      { note: 'Bb2', duration: 0.2, time: 1.5 },
      { note: 'Bb3', duration: 0.2, time: 1.75 },
      { note: 'C2', duration: 0.2, time: 2.0 },
      { note: 'C3', duration: 0.2, time: 2.25 },
      { note: 'C2', duration: 0.2, time: 2.5 },
      { note: 'C3', duration: 0.2, time: 2.75 },
      { note: 'F2', duration: 0.2, time: 3.0 },
      { note: 'F3', duration: 0.2, time: 3.25 },
      { note: 'C3', duration: 0.2, time: 3.5 },
      { note: 'Eb3', duration: 0.2, time: 3.75 }
    ]
  },
  {
    name: 'Cars',
    artist: 'Gary Numan',
    album: 'The Pleasure Principle',
    year: 1979,
    tempo: 130,
    notes: [
      // Synth pop chords / melody
      { note: 'D3', duration: 0.8, time: 0 },
      { note: 'E3', duration: 0.8, time: 0.8 },
      { note: 'F#3', duration: 0.8, time: 1.6 },
      { note: 'A3', duration: 0.8, time: 2.4 },
      { note: 'G3', duration: 1.6, time: 3.2 },
      
      { note: 'B3', duration: 0.4, time: 4.8 },
      { note: 'A3', duration: 0.4, time: 5.2 },
      { note: 'G3', duration: 0.4, time: 5.6 },
      { note: 'F#3', duration: 0.4, time: 6.0 },
      { note: 'E3', duration: 1.2, time: 6.4 }
    ]
  },
  {
    name: 'I Feel Love',
    artist: 'Giorgio Moroder / Donna Summer',
    album: 'I Remember Yesterday',
    year: 1977,
    tempo: 126,
    notes: [
      // 16th note arpeggiator
      { note: 'C2', duration: 0.1, time: 0 },
      { note: 'G2', duration: 0.1, time: 0.125 },
      { note: 'C3', duration: 0.1, time: 0.25 },
      { note: 'G2', duration: 0.1, time: 0.375 },
      { note: 'Eb2', duration: 0.1, time: 0.5 },
      { note: 'Bb2', duration: 0.1, time: 0.625 },
      { note: 'Eb3', duration: 0.1, time: 0.75 },
      { note: 'Bb2', duration: 0.1, time: 0.875 },
      
      { note: 'F2', duration: 0.1, time: 1.0 },
      { note: 'C3', duration: 0.1, time: 1.125 },
      { note: 'F3', duration: 0.1, time: 1.25 },
      { note: 'C3', duration: 0.1, time: 1.375 },
      { note: 'G2', duration: 0.1, time: 1.5 },
      { note: 'D3', duration: 0.1, time: 1.625 },
      { note: 'G3', duration: 0.1, time: 1.75 },
      { note: 'D3', duration: 0.1, time: 1.875 }
    ]
  }
];

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private primaryGain: GainNode | null = null;
  private filterNode1: BiquadFilterNode | null = null;
  private filterNode2: BiquadFilterNode | null = null; // Series for 24dB/octave
  private shelfFilter: BiquadFilterNode | null = null; // Bass compensation filter
  private analyser: AnalyserNode | null = null;
  
  // Drift LFO
  private driftLfo: OscillatorNode | null = null;
  private driftGain: GainNode | null = null;
  
  // Running synth components

  
  // Settings
  private settings: SynthSettings = {
    waveform: 'sawtooth',
    cutoff: 1500,
    resonance: 3,
    bassCompensation: false,
    revision: 'rev3',
    isMuted: false,
    volume: 0.7
  };

  // State
  public onStateChange: ((s: SynthSettings) => void) | null = null;
  public onTrackPlaying: ((trackName: string, isPlaying: boolean) => void) | null = null;
  
  // Sequencer properties
  private sequencerTimer: number | null = null;
  private currentPlayingTrack: Track | null = null;
  private trackStartTime: number = 0;
  private nextNoteIndex: number = 0;
  private isSequencerActive: boolean = false;
  
  constructor() {
    // Audio engine is initialized lazily upon user interaction to satisfy browser security
  }
  
  public init() {
    if (this.ctx) return;
    
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    this.ctx = new AudioContextClass();
    
    // Analyser Node
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 512;
    
    // Primary Gain (volume controller)
    this.primaryGain = this.ctx.createGain();
    this.primaryGain.gain.setValueAtTime(this.settings.isMuted ? 0 : this.settings.volume, this.ctx.currentTime);
    
    // Filters setup (two 12dB filters in series = 24dB/octave)
    this.filterNode1 = this.ctx.createBiquadFilter();
    this.filterNode1.type = 'lowpass';
    
    this.filterNode2 = this.ctx.createBiquadFilter();
    this.filterNode2.type = 'lowpass';
    
    // Bass compensation shelf filter
    this.shelfFilter = this.ctx.createBiquadFilter();
    this.shelfFilter.type = 'lowshelf';
    this.shelfFilter.frequency.setValueAtTime(150, this.ctx.currentTime);
    this.shelfFilter.gain.setValueAtTime(0, this.ctx.currentTime); // 0 by default
    
    // Connections:
    // Oscillators -> filterNode1 -> filterNode2 -> shelfFilter -> primaryGain -> analyser -> destination
    this.filterNode1.connect(this.filterNode2);
    this.filterNode2.connect(this.shelfFilter);
    this.shelfFilter.connect(this.primaryGain);
    this.primaryGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
    
    // Pitch Drift LFO setup
    this.driftLfo = this.ctx.createOscillator();
    this.driftLfo.frequency.setValueAtTime(0.3, this.ctx.currentTime); // Slow drift, 0.3 Hz
    this.driftLfo.type = 'sine';
    
    this.driftGain = this.ctx.createGain();
    this.driftGain.gain.setValueAtTime(0, this.ctx.currentTime); // controlled by revision parameter
    
    this.driftLfo.connect(this.driftGain);
    this.driftLfo.start();
    
    this.updateHardwareNodes();
  }
  
  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }
  
  public getSettings(): SynthSettings {
    return { ...this.settings };
  }
  
  public updateSettings(newSettings: Partial<SynthSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    
    if (!this.ctx) return;
    
    // Handle mute
    if (this.primaryGain) {
      this.primaryGain.gain.setValueAtTime(
        this.settings.isMuted ? 0 : this.settings.volume,
        this.ctx.currentTime
      );
    }
    
    this.updateHardwareNodes();
    
    if (this.onStateChange) {
      this.onStateChange(this.settings);
    }
  }

  // Update physical synth values based on state (filter, compensation, drift)
  private updateHardwareNodes() {
    if (!this.ctx || !this.filterNode1 || !this.filterNode2 || !this.shelfFilter || !this.driftGain) return;
    
    const now = this.ctx.currentTime;
    
    // 1. Cutoff Frequency
    this.filterNode1.frequency.setTargetAtTime(this.settings.cutoff, now, 0.05);
    this.filterNode2.frequency.setTargetAtTime(this.settings.cutoff, now, 0.05);
    
    // 2. Resonance (divide between the two filters for stability)
    const qValue = Math.max(0.1, this.settings.resonance * 0.7);
    this.filterNode1.Q.setTargetAtTime(qValue, now, 0.05);
    this.filterNode2.Q.setTargetAtTime(qValue, now, 0.05);
    
    // 3. Bass Compensation
    if (this.settings.bassCompensation && this.settings.resonance > 1) {
      // Boost the low-end as resonance goes up to offset volume loss
      const boostAmount = Math.min(12, (this.settings.resonance - 1) * 1.5);
      this.shelfFilter.gain.setTargetAtTime(boostAmount, now, 0.1);
    } else {
      this.shelfFilter.gain.setTargetAtTime(0, now, 0.1);
    }
    
    // 4. Pitch Drift based on revision
    let driftAmt = 0;
    if (this.settings.revision === 'rev1') {
      driftAmt = 8; // High unstable drift (Revision 1 discrete transistors)
    } else if (this.settings.revision === 'rev2') {
      driftAmt = 2.5; // Medium drift (CA3046 array)
    } else {
      driftAmt = 0.2; // Tiny realistic phase drift (UA726 stabilized)
    }
    this.driftGain.gain.setTargetAtTime(driftAmt, now, 0.1);
  }
  
  // Custom PeriodicWave for the Sharktooth waveform
  private getSharktoothWave(): PeriodicWave {
    if (!this.ctx) throw new Error('AudioContext not initialized');
    
    // Coefficients for a sharktooth-like asymmetric wave
    const waveSize = 32;
    const real = new Float32Array(waveSize);
    const imag = new Float32Array(waveSize);
    
    real[0] = 0;
    imag[0] = 0;
    
    for (let i = 1; i < waveSize; i++) {
      // Summing cosines and sines with alternating phase to create a sharktooth wave
      real[i] = 0.5 / i;
      imag[i] = (i % 2 === 0 ? 0.3 : -0.3) / i;
    }
    
    return this.ctx.createPeriodicWave(real, imag);
  }
  
  // Synthesizes a note in real-time
  public triggerNote(noteName: string, durationSec: number = 0.4, customDetune: number = 0) {
    this.init();
    if (!this.ctx || !this.filterNode1 || !this.driftGain) return;
    
    const now = this.ctx.currentTime;
    const baseFreq = NOTE_FREQS[noteName];
    if (!baseFreq) return;
    
    // Create VCO oscillators (Minimoog style: 3 oscillators)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const osc3 = this.ctx.createOscillator();
    
    const oscGain1 = this.ctx.createGain();
    const oscGain2 = this.ctx.createGain();
    const oscGain3 = this.ctx.createGain();
    
    // Set waveforms
    const applyWaveform = (osc: OscillatorNode) => {
      if (this.settings.waveform === 'sharktooth') {
        const wave = this.getSharktoothWave();
        osc.setPeriodicWave(wave);
      } else {
        osc.type = this.settings.waveform;
      }
    };
    
    applyWaveform(osc1);
    applyWaveform(osc2);
    applyWaveform(osc3);
    
    // Set oscillator frequencies (with classic detune)
    osc1.frequency.setValueAtTime(baseFreq, now);
    osc2.frequency.setValueAtTime(baseFreq, now);
    // Minimoog detuning of Osc 2 and Osc 3 for the "fat" chorused sound
    osc2.detune.setValueAtTime(-5 + customDetune, now); 
    
    osc3.frequency.setValueAtTime(baseFreq * 0.5, now); // Osc 3 runs one octave lower
    osc3.detune.setValueAtTime(6 + customDetune, now);
    
    // Connect Drift LFO to pitch detune of all oscillators for raw warm drift
    this.driftGain.connect(osc1.detune);
    this.driftGain.connect(osc2.detune);
    this.driftGain.connect(osc3.detune);
    
    // Gain levels for individual oscillators
    oscGain1.gain.setValueAtTime(0.5, now);
    oscGain2.gain.setValueAtTime(0.4, now);
    oscGain3.gain.setValueAtTime(0.4, now);
    
    // Create an envelope generator for this note
    const noteGain = this.ctx.createGain();
    noteGain.gain.setValueAtTime(0, now);
    
    // ADSR Envelope
    const attack = 0.02;
    const decay = 0.15;
    const sustain = 0.7;
    const release = 0.25;
    
    const maxVolume = 0.6;
    
    noteGain.gain.linearRampToValueAtTime(maxVolume, now + attack);
    noteGain.gain.exponentialRampToValueAtTime(maxVolume * sustain, now + attack + decay);
    
    const stopTime = now + durationSec;
    noteGain.gain.setValueAtTime(maxVolume * sustain, stopTime);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, stopTime + release);
    
    // Connect audio signal flow:
    // VCO -> oscGain -> noteGain -> filterNode1
    osc1.connect(oscGain1);
    osc2.connect(oscGain2);
    osc3.connect(oscGain3);
    
    oscGain1.connect(noteGain);
    oscGain2.connect(noteGain);
    oscGain3.connect(noteGain);
    
    noteGain.connect(this.filterNode1);
    
    // Start oscillators
    osc1.start(now);
    osc2.start(now);
    osc3.start(now);
    
    // Stop oscillators
    const fullDuration = durationSec + release + 0.1;
    osc1.stop(now + fullDuration);
    osc2.stop(now + fullDuration);
    osc3.stop(now + fullDuration);
    
    // Cleanup nodes
    setTimeout(() => {
      osc1.disconnect();
      osc2.disconnect();
      osc3.disconnect();
      oscGain1.disconnect();
      oscGain2.disconnect();
      oscGain3.disconnect();
      noteGain.disconnect();
      
      if (this.driftGain) {
        try {
          this.driftGain.disconnect(osc1.detune);
          this.driftGain.disconnect(osc2.detune);
          this.driftGain.disconnect(osc3.detune);
        } catch (e) {}
      }
    }, fullDuration * 1000 + 500);
  }
  
  // Plays a note for a single click/hover sound
  public playInterfaceClick(freq: number = 88) {
    this.init();
    if (!this.ctx || !this.filterNode1) return;
    
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    // Nice damp sine click sound
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    
    osc.connect(gain);
    gain.connect(this.filterNode1);
    
    osc.start(now);
    osc.stop(now + 0.1);
    
    setTimeout(() => {
      osc.disconnect();
      gain.disconnect();
    }, 200);
  }

  // Sequencer loop
  public playTrack(trackName: string) {
    this.init();
    if (this.isSequencerActive) {
      this.stopSequencer();
    }
    
    const track = TRACKS.find(t => t.name === trackName);
    if (!track) return;
    
    this.currentPlayingTrack = track;
    this.isSequencerActive = true;
    this.nextNoteIndex = 0;
    
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.trackStartTime = this.ctx.currentTime;
      this.scheduler();
    }
    
    if (this.onTrackPlaying) {
      this.onTrackPlaying(track.name, true);
    }
  }
  
  public stopSequencer() {
    if (this.sequencerTimer) {
      clearTimeout(this.sequencerTimer);
      this.sequencerTimer = null;
    }
    
    const oldTrackName = this.currentPlayingTrack ? this.currentPlayingTrack.name : '';
    this.currentPlayingTrack = null;
    this.isSequencerActive = false;
    
    if (this.onTrackPlaying) {
      this.onTrackPlaying(oldTrackName, false);
    }
  }

  public getPlayingTrack(): Track | null {
    return this.currentPlayingTrack;
  }
  
  private scheduler() {
    if (!this.isSequencerActive || !this.currentPlayingTrack || !this.ctx) return;
    
    const lookahead = 0.2; // How far ahead to schedule audio (seconds)
    const tempo = this.currentPlayingTrack.tempo;
    const beatDuration = 60 / tempo; // Duration of one beat in seconds
    
    const now = this.ctx.currentTime;
    
    // Find notes in the window
    const trackDurationBeats = this.currentPlayingTrack.notes.reduce((max, note) => Math.max(max, note.time + note.duration), 0);
    
    while (this.nextNoteIndex < this.currentPlayingTrack.notes.length) {
      const note = this.currentPlayingTrack.notes[this.nextNoteIndex];
      const noteTimeSeconds = note.time * beatDuration;
      const absoluteNoteTime = this.trackStartTime + noteTimeSeconds;
      
      if (absoluteNoteTime < now + lookahead) {
        // Schedule this note!
        const noteDurationSeconds = note.duration * beatDuration;
        
        // We delay triggering by the offset between note time and now
        const delay = absoluteNoteTime - now;
        setTimeout(() => {
          if (this.isSequencerActive && this.currentPlayingTrack) {
            // Add a little detune to live play depending on drift
            const driftDetune = (Math.random() - 0.5) * (this.settings.revision === 'rev1' ? 8 : this.settings.revision === 'rev2' ? 2 : 0.2);
            this.triggerNote(note.note, noteDurationSeconds * 0.9, driftDetune);
          }
        }, Math.max(0, delay * 1000));
        
        this.nextNoteIndex++;
      } else {
        break; // Note is in the future
      }
    }
    
    // Check for loop
    if (this.nextNoteIndex >= this.currentPlayingTrack.notes.length) {
      // Loop track
      const loopTimeSecs = trackDurationBeats * beatDuration;
      if (now - this.trackStartTime >= loopTimeSecs) {
        this.trackStartTime = now;
        this.nextNoteIndex = 0;
      }
    }
    
    // Schedule next polling check
    this.sequencerTimer = window.setTimeout(() => this.scheduler(), 50);
  }
}

export const audioEngine = new AudioEngine();
