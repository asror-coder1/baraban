import React from 'react';
import styles from './Navbar.module.css';

interface NavbarProps {
  theme: string;
  setTheme: (theme: string) => void;
  lang: string;
  setLang: (lang: string) => void;
  t: any;
}

const Navbar: React.FC<NavbarProps> = ({ theme, setTheme, lang, setLang, t }) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <div className={styles.wheelIcon}></div>
          <span className={styles.logoText}>wheelofnames.com</span>
        </div>
      </div>
      
      <div className={styles.right}>
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
            title="Classic Theme"
          >
            🎨
          </button>
          <button 
            className={`${styles.themeBtn} ${theme === 'light' ? styles.activeTheme : ''}`}
            onClick={() => setTheme('light')}
            title="Light Theme"
          >
            ☀️
          </button>
          <button 
            className={`${styles.themeBtn} ${theme === 'dark' ? styles.activeTheme : ''}`}
            onClick={() => setTheme('dark')}
            title="Dark Theme"
          >
            🌙
          </button>
        </div>
        <div className={styles.divider}></div>
        <button className={styles.navItem}>{t.customize}</button>
        <button className={styles.navItem}>{t.new}</button>
        <button className={styles.navItem}>{t.share}</button>
        <button className={styles.navItem}>{t.gallery}</button>
        <div className={styles.divider}></div>
        <button className={styles.navItem}>{t.more}</button>
      </div>
    </nav>
  );
};

export default Navbar;
