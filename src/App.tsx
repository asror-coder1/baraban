import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Wheel from './Wheel';
import EntriesPanel from './EntriesPanel';
import styles from './App.module.css';
import { translations } from './translations';

interface WheelData {
  id: string;
  title: string;
  names: string[];
  results: string[];
}

function App() {
  const [wheels, setWheels] = useState<WheelData[]>(() => {
    const saved = localStorage.getItem('wheels');
    return saved ? JSON.parse(saved) : [{
      id: '1',
      title: 'Wheel 1',
      names: ["Dabba", "Javohir", "Ali", "Vali", "Gani"],
      results: []
    }];
  });
  const [activeWheelId, setActiveWheelId] = useState<string>(wheels[0].id);
  const [winner, setWinner] = useState<string | null>(null);
  const [theme, setTheme] = useState<string>(() => localStorage.getItem('wheel-theme') || 'classic');
  const [lang, setLang] = useState<string>(() => localStorage.getItem('wheel-lang') || 'uz');

  const activeWheel = wheels.find(w => w.id === activeWheelId) || wheels[0];
  const t = (translations as any)[lang];

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('wheel-theme', theme);
    localStorage.setItem('wheel-lang', lang);
    localStorage.setItem('wheels', JSON.stringify(wheels));
  }, [theme, lang, wheels]);

  const handleWinner = (winnerName: string) => {
    setWinner(winnerName);
    setWheels(prev => prev.map(w => 
      w.id === activeWheelId ? { ...w, results: [winnerName, ...w.results] } : w
    ));
  };

  const setNames = (newNames: string[]) => {
    setWheels(prev => prev.map(w => 
      w.id === activeWheelId ? { ...w, names: newNames } : w
    ));
  };

  const handleAddWheel = () => {
    const newId = Date.now().toString();
    const newWheel = {
      id: newId,
      title: `${t.newWheel || "Wheel"} ${wheels.length + 1}`,
      names: ["Item 1", "Item 2", "Item 3"],
      results: []
    };
    setWheels([...wheels, newWheel]);
    setActiveWheelId(newId);
  };

  const handleRemoveWheel = (id: string) => {
    if (wheels.length <= 1) return;
    const newWheels = wheels.filter(w => w.id !== id);
    setWheels(newWheels);
    if (activeWheelId === id) {
      setActiveWheelId(newWheels[0].id);
    }
  };

  const handleNew = () => {
    if (window.confirm(t.newConfirm || "Are you sure?")) {
      setNames([]);
      setWheels(prev => prev.map(w => w.id === activeWheelId ? { ...w, results: [] } : w));
    }
  };

  const removeWinnerFromNames = () => {
    if (winner) {
      setNames(activeWheel.names.filter(n => n !== winner));
      setWinner(null);
    }
  };

  return (
    <div className={styles.app}>
      <Navbar 
        theme={theme} setTheme={setTheme} 
        lang={lang} setLang={setLang}
        t={t}
        onNew={handleNew}
        onCustomize={() => alert("Coming soon!")}
        wheels={wheels}
        activeWheelId={activeWheelId}
        setActiveWheelId={setActiveWheelId}
        onAddWheel={handleAddWheel}
        onRemoveWheel={handleRemoveWheel}
      />
      
      <div className={styles.bgGlow}></div>
      
      <main className={styles.main}>
        <div className={styles.wheelSection}>
          <div className={styles.header}>
            <h1 className={styles.title}>
              <span>{activeWheel.title}</span>
              <button className={styles.editBtn}>✏️</button>
            </h1>
          </div>
          <div className={styles.wheelWrapper}>
            <Wheel names={activeWheel.names} onWinner={handleWinner} t={t} />
          </div>
          <div className={styles.hint}>{t.clickToSpin}</div>
        </div>
        
        <aside className={styles.sidebar}>
          <EntriesPanel 
            names={activeWheel.names} 
            setNames={setNames} 
            results={activeWheel.results}
            t={t}
            onAddWheel={handleAddWheel}
          />
        </aside>
      </main>

      {winner && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} glass`}>
            <div className={styles.confetti}>🎊✨🎉</div>
            <h2 className={styles.modalTitle}>{t.winnerTitle}</h2>
            <div className={styles.winnerWrapper}>
              <p className={styles.winnerName}>{winner}</p>
            </div>
            <div className={styles.modalActions}>
              <button onClick={() => setWinner(null)} className={styles.closeBtn}>{t.close}</button>
              <button onClick={removeWinnerFromNames} className={styles.removeBtn}>{t.remove}</button>
            </div>
          </div>
        </div>
      )}
      
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.version}>v1.5.0</div>
          <div className={styles.links}>
            <span>{t.changelog}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
