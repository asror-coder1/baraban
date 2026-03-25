import React, { useState, useEffect, useRef } from "react";
import styles from "./Wheel.module.css";

const COLORS = [
  "#2563eb", // blue
  "#16a34a", // green
  "#dc2626", // red
  "#ca8a04", // yellow
  "#9333ea", // purple
  "#0891b2", // cyan
  "#ea580c", // orange
  "#4b5563", // gray
];

interface WheelProps {
  names: string[];
  onWinner: (winner: string) => void;
  t: any;
}

const Wheel: React.FC<WheelProps> = ({ names, onWinner, t }) => {
  const [rotation, setRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const spinWheel = (): void => {
    if (isSpinning || names.length === 0) return;

    setIsSpinning(true);
    
    // Minimum 5 full rotations + random extra degree
    const extraDegree = Math.floor(Math.random() * 360);
    const newDegree = rotation + 1800 + extraDegree;
    setRotation(newDegree);

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const audioContext = audioContextRef.current!;
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    const playClick = () => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start();
      osc.stop(audioContext.currentTime + 0.1);
    };

    // Simulate clicks during spin
    let clickCount = 0;
    const totalClicks = 20;
    const interval = 4000 / totalClicks;
    
    const clickInterval = setInterval(() => {
      playClick();
      clickCount++;
      if (clickCount >= totalClicks) clearInterval(clickInterval);
    }, interval);

    setTimeout(() => {
      clearInterval(clickInterval);
      setIsSpinning(false);
      
      // Calculate winner
      // The pointer is on the right (0 degrees in standard coordinate if we rotate clockwise)
      // Standard rotation is clockwise. 
      // actualDeg is the relative rotation from 0 to 359.
      const actualDeg = newDegree % 360;
      
      // WheelOfNames pointer is usually at 0 degrees (3 o'clock position)
      // or at 270 degrees (12 o'clock). In the image, it's at 3 o'clock (right).
      const segmentAngle = 360 / names.length;
      const winnerIndex = Math.floor(((360 - (actualDeg % 360)) % 360) / segmentAngle);
      
      onWinner(names[winnerIndex]);
    }, 4000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") {
        spinWheel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [names, isSpinning, rotation]);

  const getWheelBackground = () => {
    if (names.length === 0) return "var(--header-bg)";
    if (names.length === 1) return COLORS[0];

    const segmentDegree = 360 / names.length;
    const gradient = names
      .map(
        (_, i) =>
          `${COLORS[i % COLORS.length]} ${i * segmentDegree}deg ${(i + 1) * segmentDegree}deg`,
      )
      .join(", ");

    return `conic-gradient(${gradient})`;
  };

  return (
    <div className={styles.wheelContainer}>
      <div className={styles.wheelWrapper}>
        {/* Pointer on the right */}
        <div className={styles.pointer}></div>
        
        <div 
          className={styles.wheel} 
          style={{ 
            background: getWheelBackground(),
            transform: `rotate(${rotation}deg)`,
            transition: `transform 4s cubic-bezier(0.1, 0, 0, 1)`
          }}
          onClick={spinWheel}
        >
          {names.map((name, i) => (
            <div
              key={i}
              className={styles.segmentText}
              style={{
                transform: `rotate(${(360 / names.length) * i + (360 / names.length) / 2}deg)`,
              }}
            >
              {name}
            </div>
          ))}
          
          {names.length === 0 && (
            <div className={styles.centerText}>
              {t.clickToSpin}
            </div>
          )}
          
          {/* Center Circle */}
          <div className={styles.centerCircle}></div>
        </div>
      </div>
    </div>
  );
};

export default Wheel;
