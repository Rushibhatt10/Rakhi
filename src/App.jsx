import { useRef, useState } from 'react';
import config from './config/config';
import Footer from './components/Footer';
import GiftCamera from './components/GiftCamera';
import GiftBurst from './components/GiftBurst';
import GiftReveal from './components/GiftReveal';
import Hero from './components/Hero';
import MusicPlayer from './components/MusicPlayer';
import Navbar from './components/Navbar';
import PhotoWall from './components/PhotoWall';
import './App.css';

function App() {
  const [started, setStarted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [landingBurst, setLandingBurst] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const burstTimerRef = useRef(null);
  const replay = () => { window.clearTimeout(burstTimerRef.current); setStarted(false); setRevealed(false); setLandingBurst(false); setCameraOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const startExperience = () => {
    window.clearTimeout(burstTimerRef.current);
    setStarted(true);
    setLandingBurst(true);
    burstTimerRef.current = window.setTimeout(() => setLandingBurst(false), config.giftBurstDuration);
  };

  return (
    <main className="site">
      <GiftBurst active={landingBurst} />
      <Navbar />
      <Hero started={started} onStart={startExperience} />
      <PhotoWall />
      <GiftCamera onOpenChange={setCameraOpen} onReveal={() => setRevealed(true)} />
      <GiftReveal revealed={revealed} />
      {!cameraOpen && <MusicPlayer />}
      <Footer onReplay={replay} />
    </main>
  );
}

export default App;
