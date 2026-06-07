import { createContext, useContext, useState, useEffect } from 'react';
import { SmoothScroll } from './components/SmoothScroll';
import { Navbar } from './components/Navbar';
import { InteractiveBackground } from './components/ui/InteractiveBackground';
import { ModernHero } from './components/Hero/ModernHero';
import { Overview } from './components/sections/Overview';
import { Projects } from './components/sections/Projects';
import { Achievements } from './components/sections/Achievements';
import { Team } from './components/sections/Team';
import { Sponsorship } from './components/sections/Sponsorship';
import { Contact } from './components/sections/Contact';
import { Footer } from './components/sections/Footer';

// Theme Context
type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

function App() {
  const [isDark, setIsDark] = useState(true);

  // Apply dark class to body for global styles if needed
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <SmoothScroll>
        <div className={`min-h-screen overflow-x-hidden selection:bg-[#2563EB]/30 selection:text-white ${isDark ? 'dark bg-black text-slate-100' : 'bg-white text-black'}`}>
          <InteractiveBackground />
          <Navbar />
          <main className="relative z-10">
            <ModernHero />
            <Overview />
            <Projects />
            <Achievements />
            <Team />
            <Sponsorship />
            <Contact />
          </main>
          <Footer />
        </div>
      </SmoothScroll>
    </ThemeContext.Provider>
  );
}

export default App;
