import { SmoothScroll } from './components/SmoothScroll';
import { Navbar } from './components/Navbar';
import { SequenceSection } from './components/SequenceSection';
import { Overview } from './components/sections/Overview';
import { Projects } from './components/sections/Projects';
import { Team } from './components/sections/Team';
import { Footer } from './components/sections/Footer';

function App() {
  return (
    <SmoothScroll>
      <div className="min-h-screen font-aeonik overflow-x-hidden bg-[#eef2f5]">
        <Navbar />
        <main>
          <SequenceSection />
          
          <div className="relative z-20 bg-[#eef2f5] rounded-t-[3rem] -mt-12 overflow-hidden shadow-[0_-20px_40px_rgba(0,0,0,0.05)]">
            <Overview />
            <Projects />
            <Team />
          </div>
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}

export default App;
