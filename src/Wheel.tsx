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

  const playClick = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const audioContext = audioContextRef.current!;
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(10, audioContext.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0.1, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.start();
    osc.stop(audioContext.currentTime + 0.05);
  };

  const spinWheel = (): void => {
    if (isSpinning || names.length === 0) return;

    setIsSpinning(true);
    
    const extraDegree = Math.floor(Math.random() * 360);
    const newDegree = rotation + 1800 + extraDegree;
    setRotation(newDegree);

    let lastSegment = -1;
    const startTime = performance.now();
    const duration = 4000;
    
    const checkRotation = () => {
      if (wheelRef.current) {
        const style = window.getComputedStyle(wheelRef.current);
        const matrix = new DOMMatrixReadOnly(style.transform);
        const angle = Math.round(Math.atan2(matrix.b, matrix.a) * (180/Math.PI));
        const positiveAngle = (angle < 0 ? angle + 360 : angle) % 360;
        
        const segmentAngle = 360 / names.length;
        const currentSegment = Math.floor(positiveAngle / segmentAngle);
        
        if (currentSegment !== lastSegment) {
          playClick();
          lastSegment = currentSegment;
        }
      }

      const elapsed = performance.now() - startTime;
      if (elapsed < duration) {
        requestAnimationFrame(checkRotation);
      }
    };

    requestAnimationFrame(checkRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const actualDeg = newDegree % 360;
      const segmentAngle = 360 / names.length;
      const winnerIndex = Math.floor(((360 - (actualDeg % 360)) % 360) / segmentAngle);
      onWinner(names[winnerIndex]);
    }, duration);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") spinWheel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [names, isSpinning, rotation]);

  const getWheelBackground = () => {
    if (names.length === 0) return "var(--header-bg)";
    if (names.length === 1) return COLORS[0];
    const segmentDegree = 360 / names.length;
    const gradient = names.map((_, i) =>
      `${COLORS[i % COLORS.length]} ${i * segmentDegree}deg ${(i + 1) * segmentDegree}deg`
    ).join(", ");
    return `conic-gradient(${gradient})`;
  };

  return (
    <div className={styles.wheelContainer}>
      <div className={styles.wheelWrapper}>
        <div className={styles.pointer}></div>
        <div 
          ref={wheelRef}
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
          {names.length === 0 && <div className={styles.centerText}>{t.clickToSpin}</div>}
          <div className={styles.centerCircle}></div>
        </div>
      </div>
    </div>
  );
};

export default Wheel;
