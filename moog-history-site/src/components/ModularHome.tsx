// ModularHome.tsx
import React, { useState, useEffect, useRef } from 'react';
import { VUMeter } from './VUMeter';
import { audioEngine } from '../AudioEngine';
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface ModularHomeProps {
  setTab: (tab: string) => void;
  setSelectedPerson: (name: string) => void;
  setSelectedSynth: (name: string) => void;
}

export const ModularHome: React.FC<ModularHomeProps> = ({ 
  setTab,
  setSelectedPerson,
  setSelectedSynth
}) => {
  const [isPatched, setIsPatched] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [vcoPulse, setVcoPulse] = useState(false);

  const vcoJackRef = useRef<HTMLDivElement | null>(null);
  const vcfJackRef = useRef<HTMLDivElement | null>(null);
  const cabinetRef = useRef<HTMLDivElement | null>(null);

  // Pulse effect on VCO when unpatched
  useEffect(() => {
    const interval = setInterval(() => {
      setVcoPulse(prev => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleStartDrag = (e: React.MouseEvent) => {
    if (isPatched) return;
    audioEngine.playInterfaceClick(300);
    
    const rect = cabinetRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    // Position relative to container
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    
    setDragStart({ x: startX, y: startY });
    setMousePos({ x: startX, y: startY });
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !cabinetRef.current) return;
    const rect = cabinetRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  const handleConnect = (e: React.MouseEvent) => {
    if (!isDragging || isPatched) return;
    e.stopPropagation();
    
    setIsPatched(true);
    setIsDragging(false);
    setDragStart(null);
    
    // Play warm analog filter sweep note!
    audioEngine.init();
    audioEngine.updateSettings({ cutoff: 100, resonance: 8 });
    
    // Sweeping up filter frequency in Web Audio
    let cutoffSweep = 100;
    const sweepInterval = setInterval(() => {
      cutoffSweep += 150;
      if (cutoffSweep >= 2200) {
        clearInterval(sweepInterval);
        // Sweeping back to comfortable 1500
        audioEngine.updateSettings({ cutoff: 1500, resonance: 3 });
      } else {
        audioEngine.updateSettings({ cutoff: cutoffSweep });
      }
    }, 25);
    
    // Trigger the synth sound
    audioEngine.triggerNote('C3', 1.2, 0);
    audioEngine.triggerNote('C4', 1.2, 5); // detuned octave
  };

  const resetPatch = () => {
    audioEngine.playInterfaceClick(100);
    setIsPatched(false);
  };

  // Nav shortcuts
  const selectSynthDirect = (name: string) => {
    setSelectedSynth(name);
    setTab('synths');
  };

  const selectPersonDirect = (name: string) => {
    setSelectedPerson(name);
    setTab('people');
  };

  return (
    <div 
      className="cabinet-wrapper" 
      ref={cabinetRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Decorative Cabinet Screws & Rack Ears */}
      <div className="rack-ear left">
        <div className="screw top"></div>
        <div className="screw middle"></div>
        <div className="screw bottom"></div>
      </div>
      <div className="rack-ear right">
        <div className="screw top"></div>
        <div className="screw middle"></div>
        <div className="screw bottom"></div>
      </div>

      <div className="cabinet-chassis">
        {/* Module A: THE PATCHWAY */}
        <div className={`chassis-module module-patchway ${isPatched ? 'active-signal' : ''}`}>
          <div className="module-header">
            <span className="module-title">VCO-VCF MAIN SIGNAL PATH</span>
            <div className="status-led-group">
              <span className={`status-led ${isPatched ? 'green' : 'amber-blink'}`}></span>
              <span className="status-text">{isPatched ? 'SIGNAL ACTIVE' : 'NO PATTERNING'}</span>
            </div>
          </div>
          
          <div className="module-body patchway-grid">
            <div className="patch-panel">
              {/* VCO Output Jack */}
              <div className="jack-container">
                <div 
                  ref={vcoJackRef}
                  className={`synth-jack vco-out ${vcoPulse && !isPatched ? 'pulse' : ''}`}
                  onMouseDown={handleStartDrag}
                >
                  <div className="jack-ring">
                    <div className="jack-hole"></div>
                  </div>
                </div>
                <span className="jack-label">VCO OUT</span>
                <span className="jack-sub">10V P-P</span>
              </div>

              {/* Vector Signal Path Indicator */}
              <div className="signal-arrow">
                <Zap size={20} className={isPatched ? 'signal-glowing' : 'signal-dim'} />
              </div>

              {/* Ladder Filter Input Jack */}
              <div className="jack-container">
                <div 
                  ref={vcfJackRef}
                  className={`synth-jack vcf-in ${isDragging ? 'highlight-target' : ''}`}
                  onMouseUp={handleConnect}
                >
                  <div className="jack-ring">
                    <div className="jack-hole"></div>
                  </div>
                </div>
                <span className="jack-label">LADDER VCF IN</span>
                <span className="jack-sub">24dB/OCT</span>
              </div>
            </div>

            <div className="patch-instructions">
              {isPatched ? (
                <div className="patch-success">
                  <ShieldCheck className="icon-success" size={32} />
                  <h4>Analog Signal Connected!</h4>
                  <p>Audio engine initialized. The low-pass filter is fully functional. Explore the showcase modules below.</p>
                  <button className="reset-patch-btn" onClick={resetPatch}>
                    Disconnect Cable
                  </button>
                </div>
              ) : (
                <div className="patch-pending">
                  <p className="instruction-text">
                    ⚠️ <strong>WARNING:</strong> Synthesizer core offline. Click and drag a glowing amber patch cable from <strong>VCO OUT</strong> and drop it into <strong>LADDER VCF IN</strong> to complete the circuit and activate the website.
                  </p>
                  <button className="bypass-btn" onClick={() => setIsPatched(true)}>
                    Bypass Circuit Calibration
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* SVG Overlay to render the dragging/connected cable */}
          <svg className="cable-overlay-svg">
            {/* Render dragging cable */}
            {isDragging && dragStart && (
              <path
                d={`M ${dragStart.x} ${dragStart.y} C ${dragStart.x} ${dragStart.y + 120}, ${mousePos.x} ${mousePos.y + 120}, ${mousePos.x} ${mousePos.y}`}
                className="dragging-cable-path"
              />
            )}
            
            {/* Render completed patch cable */}
            {isPatched && vcoJackRef.current && vcfJackRef.current && cabinetRef.current && (
              (() => {
                const rect = cabinetRef.current.getBoundingClientRect();
                const vcoRect = vcoJackRef.current.getBoundingClientRect();
                const vcfRect = vcfJackRef.current.getBoundingClientRect();
                
                const startX = (vcoRect.left + vcoRect.width / 2) - rect.left;
                const startY = (vcoRect.top + vcoRect.height / 2) - rect.top;
                const endX = (vcfRect.left + vcfRect.width / 2) - rect.left;
                const endY = (vcfRect.top + vcfRect.height / 2) - rect.top;
                
                return (
                  <path
                    d={`M ${startX} ${startY} C ${startX} ${startY + 150}, ${endX} ${endY + 150}, ${endX} ${endY}`}
                    className="connected-cable-path"
                  />
                );
              })()
            )}
          </svg>
        </div>

        {/* Module B: TIMELINE SCRUBBER PREVIEW */}
        <div className="chassis-module module-scrubber">
          <div className="module-header">
            <span className="module-title">CHRONOLOGY TIMELINE</span>
            <span className="module-index">MOD-02</span>
          </div>
          <div className="module-body">
            <div className="timeline-mini-preview">
              <div className="milestone-card" onClick={() => setTab('timeline')}>
                <div className="milestone-year">1954</div>
                <div className="milestone-info">
                  <strong>R.A. Moog Co. Inception</strong>
                  <p>Bob Moog builds theremins in Flushing, NY, starting a musical revolution.</p>
                </div>
              </div>
              <div className="milestone-card" onClick={() => setTab('timeline')}>
                <div className="milestone-year">1970</div>
                <div className="milestone-info">
                  <strong>The Minimoog Model D</strong>
                  <p>First portable synthesizer, taking electronic sound to global concert stages.</p>
                </div>
              </div>
              <div className="milestone-card" onClick={() => setTab('timeline')}>
                <div className="milestone-year">2023</div>
                <div className="milestone-info">
                  <strong>inMusic Era Transition</strong>
                  <p>Production shifts to Taiwan, introducing the digital hybrid Messenger.</p>
                </div>
              </div>
            </div>
            <button className="module-action-btn" onClick={() => setTab('timeline')}>
              Open Full Timeline Scroll <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Bottom row modular elements */}
        <div className="modular-bottom-row">
          
          {/* Module C: INSTRUMENTS CATALOG PREVIEW */}
          <div className="chassis-module module-showroom">
            <div className="module-header">
              <span className="module-title">INSTRUMENT CATALOG</span>
              <span className="module-index">MOD-03</span>
            </div>
            <div className="module-body">
              <p className="mod-desc">Explore technical specifications, filter configurations, and circuit boards.</p>
              
              <div className="showroom-cards-grid">
                <div className="mini-synth-card" onClick={() => selectSynthDirect('Minimoog Model D')}>
                  <div className="card-top">
                    <strong>Model D (1970)</strong>
                    <span className="led-amber"></span>
                  </div>
                  <p>Traditional wood, 44 keys, 3 discrete VCOs, classic ladder filter.</p>
                </div>
                
                <div className="mini-synth-card" onClick={() => selectSynthDirect('The Messenger')}>
                  <div className="card-top">
                    <strong>Messenger (2026)</strong>
                    <span className="led-amber"></span>
                  </div>
                  <p>New Era lightweight plastic, 32 keys, digital modulation, wave folding.</p>
                </div>
              </div>
              
              <button className="module-action-btn" onClick={() => setTab('synths')}>
                Enter Showroom <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Module D: ARTIST NETWORK PREVIEW */}
          <div className="chassis-module module-artists">
            <div className="module-header">
              <span className="module-title">INNOVATORS CONNECTION</span>
              <span className="module-index">MOD-04</span>
            </div>
            <div className="module-body">
              <p className="mod-desc">Explore the network links between the creators, artists, and music.</p>
              
              <div className="people-preview-chips">
                <div className="people-chip" onClick={() => selectPersonDirect('Dr. Robert "Bob" Moog')}>
                  <span>Bob Moog</span>
                </div>
                <div className="people-chip" onClick={() => selectPersonDirect('Wendy Carlos')}>
                  <span>Wendy Carlos</span>
                </div>
                <div className="people-chip" onClick={() => selectPersonDirect('Bernie Worrell')}>
                  <span>Bernie Worrell</span>
                </div>
              </div>

              <div className="vu-meter-holder">
                <VUMeter label="SIGNAL STRENGTH" />
              </div>

              <button className="module-action-btn" onClick={() => setTab('people')}>
                Explore Network Graph <ArrowRight size={14} />
              </button>
            </div>
          </div>

        </div>

        {/* Module E: NOTEBOOK LM RESEARCH PORTAL */}
        <div className="chassis-module module-notebooklm">
          <div className="module-header">
            <span className="module-title">DEEP HISTORY RESEARCH PORTAL</span>
            <span className="module-index">MOD-05</span>
          </div>
          <div className="module-body notebook-body">
            <div className="notebook-info">
              <span className="led-green"></span>
              <h4>NotebookLM Interactive Study Guide</h4>
              <p>
                Dive deeper into the engineering schematics, legal disputes, corporate acquisitions, and cultural impacts of Moog synthesis. Access our curated history database on NotebookLM for instant audio briefings and document study.
              </p>
            </div>
            <a 
              href="https://notebooklm.google.com/notebook/d0ea2d02-6726-4f43-9327-2794c09b7ccc"
              target="_blank"
              rel="noopener noreferrer"
              className="notebook-link-btn"
              onClick={() => audioEngine.playInterfaceClick(400)}
            >
              Launch NotebookLM Research Terminal <ArrowRight size={14} />
            </a>
          </div>
        </div>

        {/* Module F: MOOGSEUM SPOTLIGHT */}
        <div className="chassis-module module-moogseum">
          <div className="module-header">
            <span className="module-title">MOOGSEUM SPOTLIGHT</span>
            <span className="module-index">MOD-06</span>
          </div>
          <div className="module-body moogseum-body">
            <div className="moogseum-info">
              <span className="moogseum-led"></span>
              <h4>Shout Out to the Moogseum!</h4>
              <p>
                An inspired museum located in Asheville, NC, celebrating the work of Bob Moog and his team of engineers who invented rock keyboarding. Explore their legacy and support their mission.
              </p>
            </div>
            <a 
              href="https://www.youtube.com/@moogfoundation"
              target="_blank"
              rel="noopener noreferrer"
              className="moogseum-link-btn"
              onClick={() => audioEngine.playInterfaceClick(400)}
            >
              Explore Moog Foundation YouTube <ArrowRight size={14} />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
