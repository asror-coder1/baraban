import React, { useState } from 'react';
import styles from './Navbar.module.css';

interface WheelData {
  id: string;
  title: string;
  names: string[];
  results: string[];
}

interface NavbarProps {
  theme: string;
  setTheme: (theme: string) => void;
  lang: string;
  setLang: (lang: string) => void;
  t: any;
  onNew: () => void;
  onCustomize: () => void;
  wheels: WheelData[];
  activeWheelId: string;
  setActiveWheelId: (id: string) => void;
  onAddWheel: () => void;
  onRemoveWheel: (id: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  theme, setTheme, lang, setLang, t, 
  onNew, onCustomize, wheels, activeWheelId, 
  setActiveWheelId, onAddWheel, onRemoveWheel 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <div className={styles.wheelIcon}></div>
          <span className={styles.logoText}>wheelofnames.com</span>
        </div>
        
        <div className={styles.wheelTabs}>
          {wheels.map(wheel => (
            <div 
              key={wheel.id} 
              className={`${styles.wheelTab} ${activeWheelId === wheel.id ? styles.activeTab : ''}`}
              onClick={() => setActiveWheelId(wheel.id)}
            >
              <span className={styles.tabTitle}>{wheel.title}</span>
              {wheels.length > 1 && (
                <button 
                  className={styles.removeWheelBtn} 
                  onClick={(e) => { e.stopPropagation(); onRemoveWheel(wheel.id); }}
                >×</button>
              )}
            </div>
          ))}
          <button className={styles.addWheelTab} onClick={onAddWheel} title={t.addWheel}>+</button>
        </div>
      </div>
      
      <button className={styles.mobileToggle} onClick={toggleMenu}>
        {isMenuOpen ? '✕' : '☰'}
      </button>

      <div className={`${styles.right} ${isMenuOpen ? styles.mobileOpen : ''}`}>
        <div className={styles.controls}>
          <select 
            className={styles.langSelect} 
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
          >
            <option value="uz">O'zb</option>
            <option value="en">Eng</option>
            <option value="ru">Рус</option>
          </select>
          
          <div className={styles.themeToggle}>
            <button 
              className={`${styles.themeBtn} ${theme === 'classic' ? styles.activeTheme : ''}`}
              onClick={() => setTheme('classic')}
            >🎨</button>
            <button 
              className={`${styles.themeBtn} ${theme === 'light' ? styles.activeTheme : ''}`}
              onClick={() => setTheme('light')}
            >☀️</button>
            <button 
              className={`${styles.themeBtn} ${theme === 'dark' ? styles.activeTheme : ''}`}
              onClick={() => setTheme('dark')}
            >🌙</button>
          </div>
        </div>

        <div className={styles.divider}></div>
        
        <div className={styles.menuItems}>
          <button className={styles.navItem} onClick={onCustomize}>
            <span className={styles.icon}>⚙️</span> {t.customize}
          </button>
          <button className={styles.navItem} onClick={onNew}>
            <span className={styles.icon}>📄</span> {t.new}
          </button>
          <button className={styles.navItem} onClick={() => alert("Share coming soon!")}>
            <span className={styles.icon}>🔗</span> {t.share}
          </button>
          <button className={styles.navItem} onClick={() => alert("Gallery coming soon!")}>
            <span className={styles.icon}>🖼️</span> {t.gallery}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
