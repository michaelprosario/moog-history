// TimelineScroll.tsx
import React, { useRef, useState } from 'react';
import { Briefcase, Info, ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { audioEngine } from '../AudioEngine';

interface TimelineEvent {
  year: string;
  title: string;
  category: 'corporate' | 'instrument' | 'cultural';
  era: string;
  description: string;
  details: string;
}

const EVENTS: TimelineEvent[] = [
  {
    year: '1954',
    title: 'The Theremin & R.A. Moog Inception',
    category: 'corporate',
    era: '1954–1971: R.A. Moog Co.',
    description: 'Dr. Robert "Bob" Moog publishes a seminal guide on the Theremin, founding R.A. Moog Co. as a mail-order kit business.',
    details: 'Bob Moog, at just 19 years old, co-publishes "The Theremin" in Radio and Television News, establishing the foundation of early touchless synthesis.'
  },
  {
    year: '1961',
    title: 'The Melodia Transistorized Theremin',
    category: 'instrument',
    era: '1954–1971: R.A. Moog Co.',
    description: 'Transition from vacuum tubes to transistors. Melodia becomes the first transistorized theremin.',
    details: ' Shirley Moog, Bob\'s mother, serves as the first catalog model. This Melodia transistor shift predated the transistorized synthesizer.'
  },
  {
    year: '1964',
    title: 'The Modular Synth Paradigm Shift',
    category: 'instrument',
    era: '1954–1971: R.A. Moog Co.',
    description: 'Collaboration with Herb Deutsch yields the first voltage-controlled modular synthesizer rigs.',
    details: 'Introduces standard ADSR envelopes, voltage-controlled oscillators (VCOs) and filters, defining the visual architecture of electronic patching.'
  },
  {
    year: '1968',
    title: 'Wendy Carlos: Switched-On Bach',
    category: 'cultural',
    era: '1954–1971: R.A. Moog Co.',
    description: 'Wendy Carlos legitimizes synthesis as fine art with the landmark baroque overdub LP.',
    details: 'Carlos uses meticulous monophonic layering to reinterpret Bach, shifting Moog Modular rigs from sci-fi sound FX to serious music.'
  },
  {
    year: '1970',
    title: 'The Minimoog Model D Prototype',
    category: 'instrument',
    era: '1954–1971: R.A. Moog Co.',
    description: 'Bill Hemsath saws a keyboard in half, creating the Model A prototype to save the company.',
    details: 'Designed to give session keyboardists a portable, normalized (cable-free) alternative to room-sized modular rigs. Features the first Pitch Wheel.'
  },
  {
    year: '1971',
    title: 'Norlin Acquisition & Buffalo Era',
    category: 'corporate',
    era: '1971–1977: Moog Buffalo',
    description: 'Bob Moog sells the brand to Bill Waytena (muSonics), which is absorbed into Norlin.',
    details: 'David Van Koevering runs the "Island of Electronicus" marketing campaign, turning the Minimoog Model D into a massive retail success.'
  },
  {
    year: '1977',
    title: 'Bernie Worrell & "Flash Light"',
    category: 'cultural',
    era: '1971–1977: Moog Buffalo',
    description: 'Parliament-Funkadelic releases the definitive masterclass in Moog synthesized bass.',
    details: 'Worrell chain-detunes three oscillators and sweeps the 24dB ladder filter, creating the pulsing sequence that defines Funk and Disco.'
  },
  {
    year: '1978',
    title: 'Big Briar Era & Bob\'s Departure',
    category: 'corporate',
    era: '1978–2002: Big Briar / Trademark Vacuum',
    description: 'Bob Moog departs Norlin, moving to Asheville, NC, to found Big Briar.',
    details: 'Focuses on building custom theremins and modulation controllers, while the "Moog Music" trademark is held by third parties.'
  },
  {
    year: '1982',
    title: 'The Memorymoog Release',
    category: 'instrument',
    era: '1978–2002: Big Briar / Trademark Vacuum',
    description: 'Moog releases its landmark polyphonic synthesizer, boasting 18 analog oscillators.',
    details: 'A massive 8-voice polyphonic synthesizer featuring three VCOs per voice, setting a polyphonic analog standard before digital synth expansion.'
  },
  {
    year: '1990s',
    title: 'The Trademark Vacuum',
    category: 'corporate',
    era: '1978–2002: Big Briar / Trademark Vacuum',
    description: 'Trademark struggles leave third-party clones in Cincinnati and rare UK Welsh synths.',
    details: 'Don Martin builds Cincinnati modular clones. Alex Winter secures UK rights, building the rare "Welsh Minimoog" (Model 204E).'
  },
  {
    year: '2002',
    title: 'Moog Reborn & The Voyager Launch',
    category: 'instrument',
    era: '2002–2023: Moog Reborn',
    description: 'Bob Moog reacquires his trademark rights, releasing the Minimoog Voyager.',
    details: 'The Voyager modernizes the Model D with MIDI, preset storage, and a tactile X/Y pressure controller, maintaining all-analog paths.'
  },
  {
    year: '2015',
    title: 'ESOP Employee Ownership Adoption',
    category: 'corporate',
    era: '2002–2023: Moog Reborn',
    description: 'Moog Music transitions into a employee-owned company in Asheville, NC.',
    details: ' Bob Moog\'s legacy survives via employee stock ownership (ESOP), reinforcing local high-end artisanal handcrafting.'
  },
  {
    year: '2023',
    title: 'inMusic Acquisition & Relocation',
    category: 'corporate',
    era: '2023–Present: inMusic Era',
    description: 'Moog is acquired by inMusic. Asheville factory laid off; manufacturing relocates to Taiwan.',
    details: 'The acquisition terminates the ESOP. High-volume synth manufacturing moves to Taiwan, sparking debates on brand authenticity.'
  },
  {
    year: '2024',
    title: 'The Moog Muse Release',
    category: 'instrument',
    era: '2023–Present: inMusic Era',
    description: 'Moog launches an 8-voice bi-timbral polyphonic synthesizer bridging historical paths.',
    details: 'Recreates the voice circuits of the Memorymoog combined with advanced sequencing. Features Memorymoog factor presets designed by Eric Frampton.'
  },
  {
    year: '2026',
    title: 'The Messenger Monosynth',
    category: 'instrument',
    era: '2023–Present: inMusic Era',
    description: 'The first synth designed entirely under inMusic, featuring a plastic chassis & USB-C.',
    details: 'Diverges from traditional wooden heft in favor of entry-level pricing. Incorporates wave folding and a resonance Bass Compensation button.'
  }
];

const ERAS = [
  { name: 'R.A. MOOG CO.', range: '1954–1971', index: 0 },
  { name: 'MOOG BUFFALO', range: '1971–1977', index: 5 },
  { name: 'BIG BRIAR', range: '1978–2002', index: 7 },
  { name: 'MOOG REBORN', range: '2002–2023', index: 10 },
  { name: 'inMUSIC ERA', range: '2023–2026', index: 12 }
];

export const TimelineScroll: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [activeEra, setActiveEra] = useState(ERAS[0].name);

  // Scroll to a specific event index
  const scrollToEvent = (index: number) => {
    audioEngine.playInterfaceClick(200);
    const container = scrollContainerRef.current;
    if (!container) return;

    const cards = container.getElementsByClassName('timeline-card-unit');
    const targetCard = cards[index] as HTMLElement;
    if (targetCard) {
      container.scrollTo({
        left: targetCard.offsetLeft - 80,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Detect active era card based on scroll position
    const cards = container.getElementsByClassName('timeline-card-unit');
    let currentActiveEra = ERAS[0].name;

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i] as HTMLElement;
      const cardLeft = card.offsetLeft - container.scrollLeft;
      if (cardLeft < 200) {
        currentActiveEra = EVENTS[i].era;
      }
    }

    // Find matching ERAS entry
    const match = ERAS.find(e => currentActiveEra.includes(e.range));
    if (match && match.name !== activeEra) {
      setActiveEra(match.name);
    }
  };

  const scrollLeft = () => {
    audioEngine.playInterfaceClick(150);
    scrollContainerRef.current?.scrollBy({ left: -350, behavior: 'smooth' });
  };

  const scrollRight = () => {
    audioEngine.playInterfaceClick(150);
    scrollContainerRef.current?.scrollBy({ left: 350, behavior: 'smooth' });
  };

  return (
    <div className="timeline-section-wrapper">
      
      {/* Era Navigation Map Header */}
      <div className="timeline-era-bar">
        {ERAS.map((era, idx) => (
          <button
            key={idx}
            className={`era-nav-pill ${activeEra === era.name ? 'active' : ''}`}
            onClick={() => scrollToEvent(era.index)}
          >
            <span className="era-title">{era.name}</span>
            <span className="era-range">{era.range}</span>
          </button>
        ))}
      </div>

      {/* Horizontal Scroll Layout */}
      <div className="scroll-controls-outer">
        <button className="timeline-arrow-btn left" onClick={scrollLeft}>
          <ArrowLeft size={18} />
        </button>

        <div 
          className="timeline-horizontal-viewport" 
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          {/* Morphing Oscilloscope Background Wave */}
          <div className="timeline-svg-backdrop">
            <svg viewBox="0 0 5000 200" className="waveform-line-svg">
              <path 
                d="M 0 100 Q 150 40 300 100 T 600 100 T 900 100 T 1200 100 T 1500 100 T 1800 100 T 2100 100 T 2400 100 T 2700 100 T 3000 100 T 3300 100 T 3600 100 T 3900 100 T 4200 100 T 4500 100 T 5000 100" 
                className="vector-sine-wave"
              />
            </svg>
          </div>

          <div className="timeline-flex-road">
            {EVENTS.map((event, idx) => (
              <div key={idx} className="timeline-card-unit" data-category={event.category}>
                <div className="timeline-card-node">
                  <div className="node-dot">
                    {event.category === 'cultural' && <Star size={12} fill="currentColor" />}
                    {event.category === 'instrument' && <Info size={12} />}
                    {event.category === 'corporate' && <Briefcase size={12} />}
                  </div>
                  <div className="node-line"></div>
                </div>

                <div className="card-box">
                  <div className="card-header">
                    <span className="card-year">{event.year}</span>
                    <span className={`category-tag ${event.category}`}>{event.category.toUpperCase()}</span>
                  </div>
                  <h3>{event.title}</h3>
                  <p className="card-summary">{event.description}</p>
                  <div className="card-extra-details">
                    <strong>HISTORICAL RECORD:</strong>
                    <p>{event.details}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="timeline-arrow-btn right" onClick={scrollRight}>
          <ArrowRight size={18} />
        </button>
      </div>

      <div className="timeline-footer-legend">
        <span className="legend-item"><Briefcase size={12} /> CORPORATE HISTORY</span>
        <span className="legend-item"><Info size={12} /> INSTRUMENT RELEASES</span>
        <span className="legend-item"><Star size={12} /> CULTURAL IMPACTS</span>
      </div>
    </div>
  );
};
