import { SmoothScroll } from './components/SmoothScroll';
import { Navbar } from './components/Navbar';
import { SequenceSection } from './components/SequenceSection';

function App() {
  return (
    <SmoothScroll>
      <div className="min-h-screen font-aeonik overflow-x-hidden bg-[#eef2f5]">
        <Navbar />
        <main>
          <SequenceSection />
          {/* Other sections removed temporarily — focusing on scroll sequence */}
          <div className="h-screen flex items-center justify-center text-gray-400 text-lg font-mono">
            ↑ Scroll sequence ends here — rest of site will go below
          </div>
        </main>
      </div>
    </SmoothScroll>
  );
}

export default App;
