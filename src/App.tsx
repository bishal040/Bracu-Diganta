import { useState, useCallback } from 'react';
import { SmoothScroll } from './components/SmoothScroll';
import { Navbar } from './components/Navbar';
import { SequenceSection } from './components/SequenceSection';
import { Overview } from './components/sections/Overview';
import { Projects } from './components/sections/Projects';
import { Achievements } from './components/sections/Achievements';
import { Team } from './components/sections/Team';
import { Contact } from './components/sections/Contact';
import { Footer } from './components/sections/Footer';
import { LoadingPage } from './components/pages';
import { SponsorUs } from './components/sections/SponsorUs';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      {isLoading && <LoadingPage onComplete={handleLoadingComplete} />}

      <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <SmoothScroll>
          <div className="min-h-screen font-aeonik overflow-x-hidden bg-[#eef2f5]">
            <Navbar />
            <main>
              <SequenceSection />
              
              <div className="relative z-20 bg-[#eef2f5] rounded-t-[3rem] -mt-12 overflow-hidden shadow-[0_-20px_40px_rgba(0,0,0,0.05)]">
                <Overview />
                <Projects />
                <Achievements />
                <Team />
                <Contact />
              </div>
            </main>
            <Footer />
          </div>
        </SmoothScroll>
      </div>
    </>
  );
}

export default App;
