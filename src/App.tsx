import { useState, useCallback } from 'react';
import { SmoothScroll } from './components/SmoothScroll';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/pages/HomePage';
import { Footer } from './components/sections/Footer';
import { LoadingPage } from './components/pages';

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
              <HomePage />
            </main>
            <Footer />
          </div>
        </SmoothScroll>
      </div>
    </>
  );
}

export default App;
