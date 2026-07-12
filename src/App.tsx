import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SpecsPage from './pages/SpecsPage';
import ScrollProgress from './components/ui/ScrollProgress';
import ScrollToTop from './components/ScrollToTop';
import SmoothScroll from './components/SmoothScroll';

export default function App() {
  return (
    <div className="grain bg-bg text-ink font-sans min-h-screen">
      <SmoothScroll />
      <ScrollProgress />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/specs" element={<SpecsPage />} />
      </Routes>
    </div>
  );
}
