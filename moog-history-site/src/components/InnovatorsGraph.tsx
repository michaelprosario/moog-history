// InnovatorsGraph.tsx
import React, { useState, useEffect } from 'react';
import { X, User, Music, Layers, BookOpen } from 'lucide-react';
import { audioEngine } from '../AudioEngine';

interface Innovator {
  id: string;
  name: string;
  role: string;
  shortDesc: string;
  fullDesc: string;
  connections: string[];
  gear: string[];
  x: number; // coordinate in SVG space
  y: number;
  videos: { id: string; title: string; desc: string }[];
}

const INNOVATORS: Innovator[] = [
  {
    id: 'bob',
    name: 'Dr. Robert "Bob" Moog',
    role: 'Founder & Electronic Engineer',
    shortDesc: 'Standardized voltage-controlled synthesis and moved electronic sound to stages.',
    fullDesc: 'Dr. Robert Moog (1934–2005) started R.A. Moog Co. as a 19-year-old mail-order theremin kit operation, publishing a seminal article "The Theremin" in Radio and Television News (Jan 1954). His pivotal 1963 collaboration with Herb Deutsch led to the development of the voltage-controlled synthesizer. Over multiple eras, including Big Briar and Moog Music, Bob prioritized tactile control and the preservation of discrete analog transistor warmth. In 2005, his Minimoog was inducted into the TECnology Hall of Fame.',
    connections: ['deutsch', 'carlos', 'emerson', 'wakeman', 'worrell', 'vagabonds'],
    gear: ['Theremin Vanguard/Melodia', 'Modular Systems', 'Minimoog Model D', 'Minimoog Voyager'],
    x: 350,
    y: 180,
    videos: [
      { id: 'XRg8R-00mjs', title: 'Moog (Documentary)', desc: 'Definitive feature-length documentary exploring Bob\'s life, creative philosophy, and deep interaction with musicians.' },
      { id: 'sLx_x5Fuzp4', title: 'A Brief History of the Minimoog Part I', desc: 'Deep dive into how Bob and his team condensed complex wall-modular systems into the portable Model D.' }
    ]
  },
  {
    id: 'deutsch',
    name: 'Herb Deutsch',
    role: 'Composer & Collaborative Catalyst',
    shortDesc: 'Collaborator who helped shape the first synthesizer\'s musical layout.',
    fullDesc: 'An experimental composer whose collaborative workshops with Bob Moog in 1963/1964 defined the synthesizer\'s musical parameters, prompting the incorporation of keyboard controls and envelope generators to make the instrument intuitive for performers.',
    connections: ['bob'],
    gear: ['Early R.A. Moog Prototypes', 'Modular Cabinet Systems'],
    x: 120,
    y: 100,
    videos: [
      { id: '5hTyTHm1J_c', title: 'GIANTS | Herb Deutsch', desc: 'Filmed retrospective interview where Herb explains his 1963 collaborative workshops with Bob Moog.' },
      { id: '87l3rcttb5c', title: 'The Mini Moog Synthesizer with Herb Deutsch', desc: 'Herb directly demonstrates and explains the building blocks of the Minimoog synthesizer.' }
    ]
  },
  {
    id: 'carlos',
    name: 'Wendy Carlos',
    role: 'Baroque Catalyst & Sound Designer',
    shortDesc: 'Legitimized the synthesizer culturally with "Switched-On Bach" in 1968.',
    fullDesc: 'Wendy Carlos brought the Moog synthesizer into cultural legitimacy with "Switched-On Bach" (1968). By painstakingly overdubbing monophonic lines and avoiding simple sci-fi sound effects, she turned the Moog Modular into a respected tool of high classical art, proving the brand\'s commercial and artistic potential.',
    connections: ['bob'],
    gear: ['Custom Moog Modular System'],
    x: 580,
    y: 100,
    videos: [
      { id: 'UsW2EDGbDqg', title: '1970: WENDY CARLOS | Music Now', desc: 'Rare archival BBC broadcast showcasing Wendy Carlos in her studio context constructing Switched-On Bach tracks.' },
      { id: 'ZrtTDzd-XS8', title: '1969 short Moog demonstration by Wendy Carlos', desc: 'Historical look at Wendy Carlos explaining and patching her custom modular synthesizer.' }
    ]
  },
  {
    id: 'emerson',
    name: 'Keith Emerson',
    role: 'ELP Progressive Rock Lead',
    shortDesc: 'Pioneered explosive solos on the legendary "Monster Moog" modular.',
    fullDesc: 'As the keyboardist for Emerson, Lake & Palmer (ELP), Keith Emerson popularized the massive "Monster Moog" modular system on massive concert stages, playing blazing synth leads on tracks like "Lucky Man" and "Tarkus" and establishing the synthesizer as a dominant live rock instrument.',
    connections: ['bob', 'wakeman'],
    gear: ['Monster Moog Modular Rig', 'Minimoog Model D'],
    x: 150,
    y: 300,
    videos: [
      { id: 'NpgS9prNZT4', title: 'Keith Emerson breaks down the moog', desc: 'Keith standing directly in front of his iconic Monster Moog modular rig, detailing how patches work.' },
      { id: 'MRYx0ySEhjk', title: 'Keith Emerson - Lucky Man Moog Solo', desc: 'Vintage performance footage demonstrating the huge sonic impact of the gliding portamento solos.' }
    ]
  },
  {
    id: 'wakeman',
    name: 'Rick Wakeman',
    role: 'Yes Keyboard Virtuoso',
    shortDesc: 'Played massive synth runs using five Minimoogs on stage.',
    fullDesc: 'The legendary keyboardist for Yes. Because the original Minimoog had no patch storage, Wakeman famously kept up to five Minimoog units on stage pre-tuned to different sounds, enabling rapid transition during complex prog-rock solos.',
    connections: ['bob', 'emerson'],
    gear: ['Multiple Minimoog Model Ds', 'Polymoog'],
    x: 350,
    y: 320,
    videos: [
      { id: 'oIuJZhDDfBg', title: 'How Bob Moog Changed Everything | Rick Wakeman', desc: 'Rick detailing his personal relationship with Bob Moog and how synths revolutionized live rock performance.' },
      { id: 'QWT63Opnk6A', title: 'Yes Interviews: Rick Wakeman & Bob Moog', desc: 'Archival audio recalling Rick\'s first encounter with the Minimoog (buying it from an actor who thought it was broken).' }
    ]
  },
  {
    id: 'worrell',
    name: 'Bernie Worrell',
    role: 'P-Funk Keyboard Mastermind',
    shortDesc: 'Redefined Funk and R&B with legendary Minimoog basslines.',
    fullDesc: 'Bernie Worrell\'s performance with Parliament-Funkadelic on "Flash Light" (1977) established the definitive Minimoog bass sound. By chaining multiple oscillators and sweeping the 24dB ladder filter with tight envelope curves, he created a bouncing, throbbing baseline that changed Funk, Disco, and Synth-Pop forever.',
    connections: ['bob'],
    gear: ['Minimoog Model D (Flash Light settings)', 'custom keyboard rigs'],
    x: 550,
    y: 300,
    videos: [
      { id: 'G2B7Rt_VA0M', title: 'Flashlight - Moog Sub 37 Synth Sounds', desc: 'Breakdown reconstruction tracing how Bernie layered oscillators and dialed filter envelopes to build the bassline.' },
      { id: 'A4GEGkkA_wM', title: 'Bernie Worrell at Moog in the am', desc: 'Raw footage showing Bernie\'s signature improvisational approach and fluid key styling at the Moog factory.' }
    ]
  },
  {
    id: 'vagabonds',
    name: 'The Trademark Vagabonds',
    role: 'The 90s Trademark Cloners',
    shortDesc: 'Don Martin & Alex Winter, who held the trademark in the 90s vacuum.',
    fullDesc: 'During Bob Moog\'s Big Briar era, the "Moog Music" brand name lay inactive or held by third parties. Don Martin cloned Moog modules in Cincinnati, eventually losing the US mark in 2002. Alex Winter registered the UK trademark in 1994, producing the rare UK "Welsh Minimoog" (Model 204E). Due to this trademark vacuum, Bob Moog was forced to badge early UK Voyagers as "By Bob Moog" rather than using the standard Moog logo.',
    connections: ['bob'],
    gear: ['Martin Modular Clones', 'Welsh Minimoog Model 204E'],
    x: 350,
    y: 60,
    videos: []
  }
];

interface InnovatorsGraphProps {
  selectedPersonName: string;
  setSelectedPersonName: (name: string) => void;
}

export const InnovatorsGraph: React.FC<InnovatorsGraphProps> = ({ 
  selectedPersonName, 
  setSelectedPersonName 
}) => {
  const [activePerson, setActivePerson] = useState<Innovator | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    if (selectedPersonName) {
      const match = INNOVATORS.find(p => p.name === selectedPersonName);
      if (match) setActivePerson(match);
    }
  }, [selectedPersonName]);

  const handleNodeClick = (person: Innovator) => {
    audioEngine.playInterfaceClick(350);
    setActivePerson(person);
    setSelectedPersonName(person.name);
  };

  const handleCloseDrawer = () => {
    audioEngine.playInterfaceClick(150);
    setActivePerson(null);
    setSelectedPersonName('');
  };

  return (
    <div className="innovators-graph-container">
      {/* Network Canvas */}
      <div className="graph-network-view">
        <div className="graph-panel-header">
          <h3>INNOVATOR INTERCONNECTIONS</h3>
          <p className="graph-help-text">
            Hover over nodes to visualize signal lines. Click nodes to open the specifications drawer.
          </p>
        </div>

        <div className="svg-canvas-wrapper">
          <svg className="network-svg" viewBox="0 0 700 400">
            {/* Draw connection lines */}
            {INNOVATORS.map(person => 
              person.connections.map((targetId, idx) => {
                const target = INNOVATORS.find(p => p.id === targetId);
                if (!target) return null;
                
                const isHighlighted = 
                  hoveredNode === person.id || 
                  hoveredNode === target.id ||
                  activePerson?.id === person.id ||
                  activePerson?.id === target.id;
                  
                return (
                  <line
                    key={`${person.id}-${targetId}-${idx}`}
                    x1={person.x}
                    y1={person.y}
                    x2={target.x}
                    y2={target.y}
                    className={`graph-link-line ${isHighlighted ? 'glowing' : ''}`}
                  />
                );
              })
            )}

            {/* Draw Nodes */}
            {INNOVATORS.map(person => {
              const isActive = activePerson?.id === person.id;
              const isHovered = hoveredNode === person.id;
              
              return (
                <g
                  key={person.id}
                  className="graph-node-group"
                  onMouseEnter={() => setHoveredNode(person.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => handleNodeClick(person)}
                >
                  {/* Glowing halo */}
                  <circle
                    cx={person.x}
                    cy={person.y}
                    r={isActive ? 32 : isHovered ? 26 : 20}
                    className={`node-halo ${isActive ? 'active' : ''} ${isHovered ? 'hovered' : ''}`}
                  />
                  
                  {/* Core Node circle */}
                  <circle
                    cx={person.x}
                    cy={person.y}
                    r={isActive ? 16 : 12}
                    className="node-core"
                  />

                  {/* Text label */}
                  <text
                    x={person.x}
                    y={person.y + (isActive ? 38 : 30)}
                    textAnchor="middle"
                    className={`node-label-text ${isActive ? 'active' : ''}`}
                  >
                    {person.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Drawer Drawer Panel */}
      <div className={`drawer-panel ${activePerson ? 'open' : 'closed'}`}>
        {activePerson && (
          <div className="drawer-inner">
            <button className="drawer-close-btn" onClick={handleCloseDrawer}>
              <X size={20} />
            </button>

            <div className="drawer-header">
              <div className="avatar-holder">
                <User size={24} className="text-amber" />
              </div>
              <div className="header-text">
                <h3>{activePerson.name}</h3>
                <span className="drawer-role-badge">{activePerson.role}</span>
              </div>
            </div>

            <div className="drawer-body">
              {/* Short Desc */}
              <p className="drawer-summary">{activePerson.shortDesc}</p>

              {/* Biography Details */}
              <div className="drawer-bio-section">
                <div className="drawer-section-title">
                  <BookOpen size={15} />
                  <span>BIOGRAPHICAL DETAILS</span>
                </div>
                <p className="drawer-full-text">{activePerson.fullDesc}</p>
              </div>

              {/* Associated Gear list */}
              <div className="drawer-gear-section">
                <div className="drawer-section-title">
                  <Layers size={15} />
                  <span>ASSOCIATED GEAR / ARTIFACTS</span>
                </div>
                <div className="drawer-gear-chips">
                  {activePerson.gear.map((g, idx) => (
                    <div key={idx} className="gear-chip">
                      {g}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bernie Bass Patch Settings (Worrell custom highlight) */}
              {activePerson.id === 'worrell' && (
                <div className="custom-patch-highlight">
                  <div className="patch-title">
                    <Music size={14} className="text-green" />
                    <strong>"FLASH LIGHT" MINIMOOG PATCH</strong>
                  </div>
                  <p>Bernie Worrell synthesized the legendary Parliament bassline by routing multiple detuned oscillators through a low-pass ladder filter. Use these settings on the <strong>SYNTHS</strong> tab:</p>
                  <div className="patch-settings-grid">
                    <div className="setting-box">
                      <span>WAVE</span>
                      <strong>Sawtooth</strong>
                    </div>
                    <div className="setting-box">
                      <span>CUTOFF</span>
                      <strong>Low (400Hz)</strong>
                    </div>
                    <div className="setting-box">
                      <span>RES</span>
                      <strong>High (7.5)</strong>
                    </div>
                    <div className="setting-box">
                      <span>COMP</span>
                      <strong>Active</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* YouTube Videos Section */}
              {activePerson.videos && activePerson.videos.length > 0 && (
                <div className="drawer-video-section">
                  <div className="drawer-section-title">
                    <Music size={15} />
                    <span>INNOVATOR IN ACTION</span>
                  </div>
                  <div className="drawer-videos-list">
                    {activePerson.videos.map((vid, idx) => (
                      <div key={idx} className="drawer-video-card">
                        <iframe
                          width="100%"
                          height="160"
                          src={`https://www.youtube.com/embed/${vid.id}`}
                          title={`${activePerson.name} - ${vid.title}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        ></iframe>
                        <div className="drawer-video-meta">
                          <strong className="drawer-video-title">{vid.title}</strong>
                          <p className="drawer-video-desc">{vid.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
