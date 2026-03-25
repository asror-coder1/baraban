import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Wheel from './Wheel';
import EntriesPanel from './EntriesPanel';
import styles from './App.module.css';
import { translations } from './translations';

function App() {
  const [names, setNames] = useState<string[]>([
    "Dabba", "Javohir", "Ali", "Vali", "Gani"
  ]);
  const [results, setResults] = useState<string[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [theme, setTheme] = useState<string>(() => {
    return localStorage.getItem('wheel-theme') || 'classic';
  });
  const [lang, setLang] = useState<string>(() => {
    return localStorage.getItem('wheel-lang') || 'uz';
  });

  const t = (translations as any)[lang];

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('wheel-theme', theme);
    localStorage.setItem('wheel-lang', lang);
  }, [theme, lang]);

  const handleWinner = (winnerName: string) => {
    setWinner(winnerName);
    setResults(prev => [winnerName, ...prev]);
  };

  const closeModal = () => {
    setWinner(null);
  };

  const removeWinnerFromNames = () => {
    if (winner) {
      setNames(prev => prev.filter(n => n !== winner));
      setWinner(null);
    }
  };

  return (
    <div className={styles.app}>
      <Navbar 
        theme={theme} setTheme={setTheme} 
        lang={lang} setLang={setLang}
        t={t}
      />
      
      <main className={styles.main}>
        <div className={styles.wheelSection}>
          <div className={styles.header}>
            <h1 className={styles.title}>Dabba <button className={styles.editBtn}>✏️</button></h1>
          </div>
          <Wheel names={names} onWinner={handleWinner} t={t} />
        </div>
        
        <aside className={styles.sidebar}>
          <EntriesPanel 
            names={names} 
            setNames={setNames} 
            results={results}
            t={t}
          />
        </aside>
      </main>

      {winner && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} glass`}>
            <div className={styles.confetti}>🎉🎉🎉</div>
            <h2 className={styles.modalTitle}>{t.winnerTitle}</h2>
            <p className={styles.winnerName}>{winner}</p>
            <div className={styles.modalActions}>
              <button onClick={closeModal} className={styles.closeBtn}>{t.close}</button>
              <button onClick={removeWinnerFromNames} className={styles.removeBtn}>{t.remove}</button>
            </div>
          </div>
        </div>
      )}
      <footer className={styles.footer}>
        <div className={styles.version}>{t.version} 1.0.0</div>
        <div className={styles.changelog}>{t.changelog}</div>
      </footer>
    </div>
  );
}

export default App;
