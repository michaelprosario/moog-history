// VUMeter.tsx
import React, { useEffect, useState, useRef } from 'react';
import { audioEngine } from '../AudioEngine';

interface VUMeterProps {
  label?: string;
}

export const VUMeter: React.FC<VUMeterProps> = ({ label = 'OUTPUT LEVEL' }) => {
  const [needleRotation, setNeedleRotation] = useState(-45); // -45deg is -20dB, +45deg is +3dB
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const bufferLength = 64;
    const dataArray = new Uint8Array(bufferLength);
    
    const updateNeedle = () => {
      const analyser = audioEngine.getAnalyser();
      let targetRotation = -45; // default minimum
      
      if (analyser) {
        analyser.getByteTimeDomainData(dataArray);
        
        // Calculate RMS (Root Mean Square) for volume estimation
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          const val = (dataArray[i] - 128) / 128; // normalized to [-1, 1]
          sum += val * val;
        }
        const rms = Math.sqrt(sum / bufferLength);
        
        // Map RMS (0 to ~0.5 for typical synthesized waves) to rotation (-45 to 35 degrees)
        // Add some random vibration to look organic like a mechanical coil
        const noise = (Math.random() - 0.5) * 4;
        const volumeFactor = Math.min(1.0, rms * 2.5);
        targetRotation = -45 + volumeFactor * 80 + noise;
      } else {
        // If not playing, slowly decay to -45
        targetRotation = -45;
      }
      
      // Interpolate for physical inertia (damping/spring feel)
      setNeedleRotation(prev => {
        const diff = targetRotation - prev;
        return prev + diff * 0.25; // physical lag
      });
      
      animationRef.current = requestAnimationFrame(updateNeedle);
    };

    updateNeedle();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="vu-meter">
      <div className="vu-scale">
        <div className="vu-ticks">
          <span className="vu-text min">-20</span>
          <span className="vu-text">-10</span>
          <span className="vu-text">-5</span>
          <span className="vu-text">0</span>
          <span className="vu-text max">+3dB</span>
        </div>
        <div className="vu-red-zone"></div>
        <div 
          className="vu-needle" 
          style={{ transform: `rotate(${needleRotation}deg)` }} 
        />
        <div className="vu-pivot"></div>
        <div className="vu-lamp-glow" />
      </div>
      <div className="vu-label">{label}</div>
    </div>
  );
};
