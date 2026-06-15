import { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SmoothScroll } from './components/SmoothScroll';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/pages/HomePage';
import { CansatPage } from './components/pages/CansatPage';
import { Footer } from './components/sections/Footer';
import { LoadingPage, TeamPage, MissionsPage, ProjectDetailPage, ComingSoonPage, NewsCansat2026Page, CareersPage } from './components/pages';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <Router>
      {isLoading && <LoadingPage onComplete={handleLoadingComplete} />}

      <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <SmoothScroll>
          <div className="min-h-screen font-aeonik overflow-x-hidden bg-[#eef2f5]">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/news/cansat-2026" element={<NewsCansat2026Page />} />
                <Route path="/project/cansat-2024" element={<CansatPage />} />
                <Route path="/coming-soon" element={<ComingSoonPage />} />
                <Route path="/project/:slug" element={<ProjectDetailPage />} />
                <Route path="/missions" element={<MissionsPage />} />
                <Route path="/team" element={<TeamPage />} />
                <Route path="/careers" element={<CareersPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </SmoothScroll>
      </div>
    </Router>
  );
}

export default App;
