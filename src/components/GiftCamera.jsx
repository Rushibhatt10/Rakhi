import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import config from '../config/config';
import GiftBurst from './GiftBurst';
import PhotoStrip from './PhotoStrip';

function GiftCamera({ onOpenChange, onReveal }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timersRef = useRef([]);
  const [cameraState, setCameraState] = useState('idle');
  const [facingMode, setFacingMode] = useState('user');
  const [photoShots, setPhotoShots] = useState([]);
  const [shotNumber, setShotNumber] = useState(0);
  const [flowMessage, setFlowMessage] = useState('');
  const [countdown, setCountdown] = useState(null);
  const [flash, setFlash] = useState(false);

  const clearTimers = () => { timersRef.current.forEach((timer) => window.clearTimeout(timer)); timersRef.current = []; };
  const stopStream = () => { streamRef.current?.getTracks().forEach((track) => track.stop()); streamRef.current = null; };

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamRef.current) return undefined;
    video.srcObject = streamRef.current;
    video.playsInline = true; video.autoplay = true; video.muted = true;
    video.play().catch(() => {});
    return () => { video.srcObject = null; };
  }, [cameraState, shotNumber]);

  useEffect(() => {
    const isOpen = cameraState !== 'idle';
    onOpenChange?.(isOpen);
    document.body.classList.toggle('cameraModalOpen', isOpen);

    return () => {
      onOpenChange?.(false);
      document.body.classList.remove('cameraModalOpen');
    };
  }, [cameraState, onOpenChange]);

  const openCamera = async (requestedFacingMode = facingMode) => {
    setCameraState('requesting');
    stopStream();
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) { setCameraState('error'); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: requestedFacingMode }, width: { ideal: 1080 }, height: { ideal: 1920 } }, audio: false });
      streamRef.current = stream;
      setCameraState('scanning');
      timersRef.current.push(window.setTimeout(() => setCameraState('ready'), 1200));
    } catch (error) { console.warn('Camera permission or device error:', error); stopStream(); setCameraState('error'); }
  };

  const closeCamera = () => { clearTimers(); stopStream(); setPhotoShots([]); setShotNumber(0); setFlowMessage(''); setCountdown(null); setCameraState('idle'); };

  const flipCamera = async () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';


    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: nextMode }, width: { ideal: 1080 }, height: { ideal: 1920 } }, audio: false });
      const previousStream = streamRef.current;
      streamRef.current = stream;
      previousStream?.getTracks().forEach((track) => track.stop());
      setFacingMode(nextMode); setShotNumber((number) => number + 1);
    } catch (error) { console.warn('Unable to flip camera:', error); }
  };

  const captureFrame = () => {
    const video = videoRef.current;
    if (!video?.videoWidth) return null;
    const canvas = document.createElement('canvas'); canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.92);
  };

  const beginGiftFlow = () => {
    clearTimers(); setCameraState('countdown'); setFlowMessage('PHOTO LOCKED.');
    timersRef.current.push(window.setTimeout(() => setFlowMessage('WAIT...'), 850));
    timersRef.current.push(window.setTimeout(() => setFlowMessage('YOUR GIFT IS LOADING...'), 1700));
    timersRef.current.push(window.setTimeout(() => { setCountdown(3); setFlowMessage(''); }, 2800));
    timersRef.current.push(window.setTimeout(() => setCountdown(2), 3700));
    timersRef.current.push(window.setTimeout(() => setCountdown(1), 4600));
    timersRef.current.push(window.setTimeout(() => { setCountdown(null); setCameraState('burst'); }, 5500));
    timersRef.current.push(window.setTimeout(() => { setCameraState('revealed'); stopStream(); onReveal(); }, 5500 + config.giftBurstDuration));
  };

  const startPhotoBooth = () => {
    clearTimers(); setPhotoShots([]); setShotNumber(0); setCameraState('session');
    const takePhoto = (number) => {
      setShotNumber(number);
      setFlowMessage(config.photoBoothConfig.posePrompts[number - 1]);
      window.setTimeout(() => {
        setFlash(true);
        window.setTimeout(() => setFlash(false), 150);
        const frame = captureFrame();
        if (frame) setPhotoShots((shots) => [...shots, frame]);
      }, 140);
    };
    takePhoto(1);
    timersRef.current.push(window.setTimeout(() => takePhoto(2), 1800));
    timersRef.current.push(window.setTimeout(() => takePhoto(3), 3500));
    timersRef.current.push(window.setTimeout(() => { setFlowMessage('PHOTOBOOTH RESULT'); setCameraState('captured'); }, 5000));
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (cameraState === 'idle') return;
      if (event.key === 'Escape') closeCamera();
      if (event.key.toLowerCase() === 'f' && cameraState === 'ready') flipCamera();
      if (event.code === 'Space' && cameraState === 'ready') { event.preventDefault(); startPhotoBooth(); }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [cameraState, facingMode]);

  useEffect(() => () => { clearTimers(); stopStream(); }, []);

  const isOpen = cameraState !== 'idle';
  return (
    <section id="gift-cam" className="section cameraSection">
      <h2>YOUR GIFT CAM</h2>
      <p>{config.messages.camera}</p>
      <button className="primary openGiftCam" type="button" onClick={openCamera}>OPEN GIFT CAM ↗</button>
      {isOpen && createPortal(
        <div className={`cameraExperience state-${cameraState}`} role="dialog" aria-modal="true" aria-label="Rakhi Magic Cam">
          <header className="cameraHeader"><div><span className="cameraEyebrow">RAKHI '26 / MAGIC CAM</span><h3>YOUR GIFT CAM</h3><p>{config.messages.camera}</p></div><button type="button" onClick={closeCamera} aria-label="Close camera">×</button></header>
          {cameraState === 'requesting' && <div className="cameraLoading"><span className="loaderRing" /> OPENING CAMERA...</div>}
          {cameraState === 'error' && <div className="cameraFallback"><strong>CAMERA IS BEING SHY 👀</strong><span>That's totally okay.</span><button className="primary" type="button" onClick={beginGiftFlow}>CONTINUE WITHOUT CAMERA →</button></div>}
          {cameraState === 'captured' ? <div className="cameraStage"><PhotoStrip photos={photoShots} onRetake={() => { setPhotoShots([]); setShotNumber(0); setCameraState('ready'); }} onUse={beginGiftFlow} /></div> : cameraState === 'countdown' || cameraState === 'burst' || cameraState === 'revealed' ? <div className="cameraStage"><div className="lockedPhoto">{photoShots[0] && <img src={photoShots[0]} alt="Your locked Rakhi moment" />}<span className="lockScan" /></div><div className="flowMessage">{countdown || flowMessage}</div></div> : <div className="cameraStage"><div className="cameraViewport magicViewport"><video ref={videoRef} playsInline autoPlay muted />{flash && <span className="photoFlash" aria-hidden="true" />}</div><div className="cameraActions cameraActionsPlain"><button className="roundControl" type="button" onClick={flipCamera} aria-label="Flip camera">↻</button></div>{cameraState === 'ready' && <button className="primary photoStripButton" type="button" onClick={startPhotoBooth}>START PHOTOBOOTH ✨</button>}<p className="cameraHint">{cameraState === 'session' ? flowMessage : cameraState === 'scanning' ? 'SCANNING...' : 'Pose mode: activated.'}</p></div>}
          {cameraState === 'burst' && <GiftBurst active />}
        </div>,
        document.body
      )}
    </section>
  );
}

export default GiftCamera;
