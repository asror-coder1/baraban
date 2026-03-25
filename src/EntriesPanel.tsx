import React, { useState, useEffect } from 'react';
import styles from './EntriesPanel.module.css';

interface EntriesPanelProps {
  names: string[];
  setNames: (names: string[]) => void;
  results: string[];
  t: any;
  onAddWheel: () => void;
}

const EntriesPanel: React.FC<EntriesPanelProps> = ({ names, setNames, results, t, onAddWheel }) => {
  const [activeTab, setActiveTab] = useState<'entries' | 'results'>('entries');
  const [inputText, setInputText] = useState<string>(names.join('\n'));

  // Sync text area when names change from outside (e.g. removing a winner)
  // But ONLY if the user is not currently typing to avoid losing selection/newlines
  useEffect(() => {
    const currentLines = inputText.trim().split('\n');
    const namesEqual = JSON.stringify(currentLines) === JSON.stringify(names);
    
    if (!namesEqual) {
      setInputText(names.join('\n'));
    }
  }, [names]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
    
    // Parse names but don't force-sync back to inputText during change
    const newNames = text.split('\n')
      .map(n => n.trim())
      .filter(n => n !== '');
    
    setNames(newNames);
  };

  const shuffleNames = () => {
    const shuffled = [...names].sort(() => Math.random() - 0.5);
    setNames(shuffled);
    setInputText(shuffled.join('\n'));
  };

  const sortNames = () => {
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    setNames(sorted);
    setInputText(sorted.join('\n'));
  };

  return (
    <div className={`${styles.panel} glass`}>
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'entries' ? styles.active : ''}`}
          onClick={() => setActiveTab('entries')}
        >
          {t.entries} <span className={styles.badge}>{names.length}</span>
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'results' ? styles.active : ''}`}
          onClick={() => setActiveTab('results')}
        >
          {t.results} <span className={styles.badge}>{results.length}</span>
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'entries' ? (
          <>
            <div className={styles.toolbar}>
              <button onClick={shuffleNames} className={styles.toolBtn}>{t.shuffle}</button>
              <button onClick={sortNames} className={styles.toolBtn}>{t.sort}</button>
              <button className={styles.toolBtn}>{t.addImage}</button>
            </div>
            
            <textarea
              className={styles.textarea}
              placeholder={t.placeholder}
              value={inputText}
              onChange={handleInputChange}
            />
            
            <div className={styles.footer}>
              <label className={styles.checkbox}>
                <input type="checkbox" /> {t.advanced}
              </label>
            </div>
          </>
        ) : (
          <div className={styles.resultsList}>
            {results.length > 0 ? (
              results.map((res, i) => (
                <div key={i} className={styles.resultItem}>
                  {res}
                </div>
              ))
            ) : (
              <p className={styles.emptyResults}>{t.noResults}</p>
            )}
          </div>
        )}
      </div>

      <div className={styles.bottomActions}>
        <button className={styles.addWheelBtn} onClick={onAddWheel}>
          <span>+</span> {t.addWheel}
        </button>
      </div>
    </div>
  );
};

export default EntriesPanel;
