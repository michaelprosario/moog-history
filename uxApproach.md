# Moog Synths History & Influence: UX Layout & Interaction Plan

This document details the visual layouts, page wireframes, and interactive components for the Moog History & Influence website. It translates the informational taxonomy defined in [nav.md](file:///home/user/moog-history/nav.md) and the raw historical content in the [info](file:///home/user/moog-history/info/) directory into a rocking, highly engaging user experience.

---

## 1. Visual Identity & Design Tokens (The Moog Aesthetic)

To capture the "tactile warmth" of classic hardware while maintaining modern performance, we define the following styling tokens:

| Token Category | Key | Value / Spec | UX Rationale |
| :--- | :--- | :--- | :--- |
| **Colors** | Obsidian Base | `#080808` | Deep void representing the lack of signal. |
| | Gunmetal Panel | `#1C1C1F` | Textured background for cards and modules. |
| | Pilot Lamp Amber | `#FF9A00` | Accent color for active states, knobs, and highlights. |
| | Signal Green | `#00FF66` | Glowing oscilloscope lines and synth patch paths. |
| **Typography** | Headers | `Outfit` (Sans-Serif, Geometric) | Modern, clean, reminiscent of high-end lab gear. |
| | Body | `Inter` (Sans-Serif, Variable) | High readability for deep-dive historical articles. |
| | Technical Specs | `JetBrains Mono` (Monospaced) | Fits schematics, values, and patch configuration data. |
| **Transitions** | Spring Physics | `stiffness: 150, damping: 15` | Feels organic and physical rather than linear/digital. |

---

## 2. Layout Structure & Page Wireframes

### View 1: The Modular Homepage (Home)
The landing page is designed to look like a massive modular synth cabinet. Rather than a standard scrolling grid, it is divided into visual "chassis modules" framed by rack-mount ears and industrial screws.

```
+-------------------------------------------------------------------------+
| [MOOG LOGO]                  [Search Artists, Synths, Tracks...]        |
+-------------------------------------------------------------------------+
|                                                                         |
|  +------------------------+  +---------------------------------------+  |
|  | Module A: THE PATCHWAY |  | Module B: TIMELINE SCRUBBER           |  |
|  |                        |  |                                       |  |
|  | Connect virtual patch  |  | Drag the timeline playhead to scroll  |  |
|  | cables to hear         |  | from 1954 to 2026.                    |  |
|  | different oscillators. |  |                                       |  |
|  | [O]---->----[O]        |  | [ R.A. Moog ]-->-[ Norlin ]-->-[ Muse ] |  |
|  +------------------------+  +---------------------------------------+  |
|                                                                         |
|  +------------------------+  +---------------------------------------+  |
|  | Module C: INSTRUMENTS  |  | Module D: ARTIST NETWORK              |  |
|  |                        |  |                                       |  |
|  | Interactive catalog    |  | Visualizing connections between Bob,  |  |
|  | of synths from         |  | Wendy Carlos, Kraftwerk, & more.      |  |
|  | Modular to Messenger.  |  | (Graph View)                          |  |
|  +------------------------+  +---------------------------------------+  |
|                                                                         |
+-------------------------------------------------------------------------+
| [RACK PLAYER] 🔊 Wendy Carlos - Switched-On Bach (1968)      [==|==\==] |
+-------------------------------------------------------------------------+
```

*   **Primary Interaction (The Hook)**: Users can click and drag a glowing virtual patch cable from the "VCO Output" jack to the "Ladder Filter Input" jack. Doing so triggers a warm analog filter sweep sound and reveals the site navigation.
*   **The Bottom Rack Player**: A persistent, hardware-styled audio footer displaying the current track. It features an active green canvas oscilloscope showing the waveform of the audio.

---

## 3. Section Layouts & Information Mapping

We map the text resources from [info/overview.md](file:///home/user/moog-history/info/overview.md), [info/artists.md](file:///home/user/moog-history/info/artists.md), and [info/tech.md](file:///home/user/moog-history/info/tech.md) into dedicated page structures:

### View 2: Instruments (The Showroom)
*Layout: Split-pane dashboard.*
*   **Left Column (3D Showcase & Soundboard)**:
    *   A rotating high-res image of the selected synthesizer (e.g., Minimoog Model D, Voyager, or Messenger).
    *   An interactive waveform selector panel allowing users to test the **Triangle**, **Sawtooth**, **Square/Pulse**, and early-discrete **Sharktooth** wave generators (drawn from [info/tech.md Section 3](file:///home/user/moog-history/info/tech.md#L27-L42)).
    *   A massive **Ladder Filter Cutoff Knob** that users can drag up/down. Dragging it filters the audio sample in real-time using a simulated 24dB/octave low-pass sweep.
*   **Right Column (Historical & Technical Specs)**:
    *   **The Hardware Spec Card**: Details the mechanical differences. *Highlight*: A comparison panel contrasting the "Traditional Moog" (Handcrafted Wood and Steel, 44-note keys, Asheville-made) against the "New Era" (Messenger: Plastic chassis, 32-note keys, Taiwan-made) as documented in [info/tech.md Section 7](file:///home/user/moog-history/info/tech.md#L67-L80).
    *   **Filter Stability Note**: Explains the new "Bass Compensation" button on the Messenger which counteracts low-end loss when resonance increases ([info/overview.md Section III](file:///home/user/moog-history/info/overview.md#L68-L75)).
    *   **Circuit Revision Toggle**: For the Minimoog Model D, users can toggle between **Revision 1** (discrete transistor core, sweet but drift-heavy), **Revision 2** (CA3046 array), and **Revision 3** (UA726 op-amp) to see how the specs changed ([info/overview.md Section II](file:///home/user/moog-history/info/overview.md#L46-L53)).

### View 3: People (The Innovators Graph)
*Layout: Force-directed connection graph.*
*   **Visual Interface**: A web of glowing amber nodes representing key people. Clicking a node highlights its links (e.g., collaborating, performing, designing).
*   **Pop-out Side Panel (The Rack Drawer)**: Clicking a person slides open a drawer containing:
    *   **Dr. Robert "Bob" Moog**: Details his journey from building theremins at age 19, publishing his seminal theremin paper in 1954, to his TECnology Hall of Fame induction ([info/tech.md Section 1](file:///home/user/moog-history/info/tech.md#L3-L13)).
    *   **Wendy Carlos**: Explores her role in establishing the Moog's cultural legitimacy with *Switched-On Bach* ([info/artists.md Section 2](file:///home/user/moog-history/info/artists.md#L7-L12)).
    *   **Bernie Worrell**: Showcases his Minimoog bass settings (the exact parameters for the "Flash Light" bassline) and details his influence on Funk and Disco ([info/artists.md Section 5](file:///home/user/moog-history/info/artists.md#L35-L40)).
    *   **The Trademark Vagabonds**: Highlights the "Trademark Vacuum" of the 90s, including **Don Martin** (Cincinatti clones) and **Alex Winter** (UK "Welsh Minimoog" Model 204E) ([info/overview.md Section I](file:///home/user/moog-history/info/overview.md#L20-L26)).

### View 4: Timeline (Chronological Scroll)
*Layout: Horizontal infinite scrolling path.*
*   **Interaction**: Users scroll horizontally. A background vector line mimics an analog audio wave, bending and morphing as they cross different corporate eras:
    1.  **1954–1971 (R.A. Moog Co.)**: Early theremins (Melodia, Vanguard), Herb Deutsch collaborations, and the first modular rigs.
    2.  **1971–1977 (Moog Music Buffalo)**: The Minimoog Model D retail explosion under Norlin/Waytena.
    3.  **1978–2002 (Big Briar)**: Bob Moog's departure, theremin-focused engineering, and the trademark division.
    4.  **2002–2023 (Moog Reborn)**: Trademark recovery, the Voyager release, adoption of ESOP employee ownership.
    5.  **2023–Present (inMusic Era)**: The shift of production to Taiwan, Asheville layoffs, and the release of the Muse and Messenger ([info/overview.md Section IV](file:///home/user/moog-history/info/overview.md#L76-L91)).

---

## 4. Keeping it Rocking: Motion & Audio Strategy

To make sure the website feels dynamic ("rocking"), we will employ these specific UX patterns:

### 1. Retro VU Meters for Load States
Instead of generic spinner wheels, site loading states and page transitions will use animated vintage VU needle meters that bounce in sync with ambient synth soundscapes.

### 2. Synthesizer sound preview on hover
When hovering over key links, a very quiet, low-octave Moog bass note plays (using a low-pass envelope filter so it doesn't irritate the user).
*   *Implementation Tip*: Sound can be toggled off globally via a prominent mute icon on the header next to the search bar.

### 3. Tactile Feedback on Knob Adjustments
When users sweep knobs or slide virtual faders:
*   A faint, retro plastic click sound triggers when they reach the minimum or maximum thresholds.
*   The cursor changes into a "hand grip" cursor, mimicking grabbing physical knobs.

---

## 5. Technical Requirements for Implementation

1.  **Frontend Logic**: Vanilla Javascript utilizing the Web Audio API for generating the live VCO waveforms and running the custom ladder-filter simulation node.
2.  **Asset Management**: No placeholder images. Use SVG vector drawings for instrument faceplates and layouts, ensuring clean scalability and crisp lines on high-DPI displays.
3.  **Accessibility (a11y)**:
    *   Provide full keyboard alternatives for the virtual patch bay (e.g., pressing `Tab` focuses patch terminals; hitting `Enter` connects them).
    *   Maintain high contrast ratio (4.5:1 minimum) using the glowing Amber (`#FF9A00`) and Obsidian (`#080808`) colors.
