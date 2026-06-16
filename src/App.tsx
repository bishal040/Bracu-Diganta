import { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SmoothScroll } from './components/SmoothScroll';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/pages/HomePage';
import { CansatPage } from './components/pages/CansatPage';
import { Footer } from './components/sections/Footer';
import { LoadingPage, TeamPage, MissionsPage, ProjectDetailPage, ComingSoonPage, NewsCansat2026Page, CareersPage, NewsTeknofest2026Page, TimelinePage } from './components/pages';
import { ToastProvider } from './components/ui/ToastProvider';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <ToastProvider>
      <Router>
        {isLoading && <LoadingPage onComplete={handleLoadingComplete} />}

        <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
          <SmoothScroll>
            <div className="min-h-screen font-aeonik bg-[#eef2f5]">
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/news/cansat-2026" element={<NewsCansat2026Page />} />
                  <Route path="/news/teknofest-2026" element={<NewsTeknofest2026Page />} />
                  <Route path="/project/cansat-2024" element={<CansatPage />} />
                  <Route path="/coming-soon" element={<ComingSoonPage />} />
                  <Route path="/project/:slug" element={<ProjectDetailPage />} />
                  <Route path="/missions" element={<MissionsPage />} />
                  <Route path="/team" element={<TeamPage />} />
                  <Route path="/careers" element={<CareersPage />} />
                  <Route path="/timeline" element={<TimelinePage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </SmoothScroll>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
