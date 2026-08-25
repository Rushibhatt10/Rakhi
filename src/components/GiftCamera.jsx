import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import config from '../config/config';
import GiftBurst from './GiftBurst';
import PhotoBooth from './PhotoBooth';
import CameraOverlay from './CameraOverlay';
import { playShutterSound } from '../utils/shutterAudio';

function GiftCamera({ onOpenChange, onReveal }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timersRef = useRef([]);
  const [cameraState, setCameraState] = useState('idle'); // 'idle' | 'requesting' | 'ready' | 'session' | 'result' | 'countdown' | 'burst' | 'revealed' | 'error'
  const [facingMode, setFacingMode] = useState('user');
  const [photoShots, setPhotoShots] = useState([]);
  const [shotNumber, setShotNumber] = useState(0);
  const [promptText, setPromptText] = useState('');
  const [countdown, setCountdown] = useState(null);
  const [flash, setFlash] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [zoomRange, setZoomRange] = useState(null);

  const clearTimers = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  };

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  // Bind video element to media stream
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamRef.current) return undefined;
    video.srcObject = streamRef.current;
    video.playsInline = true;
    video.autoplay = true;
    video.muted = true;
    video.play().catch(() => {});
    return () => {
      if (video) video.srcObject = null;
    };
  }, [cameraState, facingMode]);

  // Modal open lock state
  useEffect(() => {
    const isOpen = cameraState !== 'idle';
    onOpenChange?.(isOpen);
    document.body.classList.toggle('cameraModalOpen', isOpen);

    return () => {
      onOpenChange?.(false);
      document.body.classList.remove('cameraModalOpen');
    };
  }, [cameraState, onOpenChange]);

  // Open camera hardware — natural field of view, no zoom
  const openCamera = async (requestedFacingMode = facingMode) => {
    setCameraState('requesting');
    stopStream();
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      setCameraState('error');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: requestedFacingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      streamRef.current = stream;
      setFacingMode(requestedFacingMode);
      const cameraTrack = stream.getVideoTracks()[0];
      const capabilities = cameraTrack?.getCapabilities?.();
      setZoomRange(capabilities?.zoom ? { min: capabilities.zoom.min, max: capabilities.zoom.max, step: capabilities.zoom.step || 0.1 } : null);
      setZoom(capabilities?.zoom?.min || 1);
      setCameraState('ready');
    } catch (error) {
      console.warn('Camera permission or device error:', error);
      stopStream();
      setCameraState('error');
    }
  };

  const closeCamera = () => {
    clearTimers();
    stopStream();
    setPhotoShots([]);
    setShotNumber(0);
    setPromptText('');
    setCountdown(null);
    setFlash(false);
    setZoomRange(null);
    setZoom(1);
    setCameraState('idle');
  };

  const flipCamera = async () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    await openCamera(nextMode);
  };

  const setCameraZoom = async (value) => {
    if (!zoomRange) return;
    const nextZoom = Math.min(zoomRange.max, Math.max(zoomRange.min, value));
    try {
      await streamRef.current?.getVideoTracks()[0]?.applyConstraints({ advanced: [{ zoom: nextZoom }] });
      setZoom(nextZoom);
    } catch (error) { console.warn('Camera zoom is not supported:', error); }
  };

  // Capture full natural frame — no crop, no zoom
  const captureFrame = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return null;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

    // Mirror front camera to match the viewfinder
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.95);
  };

  const triggerShutterFlash = () => {
    setFlash(true);
    playShutterSound();
    timersRef.current.push(window.setTimeout(() => setFlash(false), 160));
  };

  // Start 5-second automatic 3-shot Photobooth session
  const runPhotoBoothSession = () => {
    clearTimers();
    setPhotoShots([]);
    setShotNumber(0);
    setCameraState('session');

    const prompts = config.photoBoothConfig.posePrompts || [
      'Okay, normal one 👀',
      'Now give me your best pose ✨',
      'Okay... final boss 😭',
    ];

    const capturedList = [];

    // 0.0s: Initial Ready
    setPromptText('GET READY...');
    setCountdown('GET READY');
    setShotNumber(1);

    // 0.7s: Countdown 3
    timersRef.current.push(
      window.setTimeout(() => {
        setCountdown('3');
        setPromptText(prompts[0]);
      }, 700)
    );

    // 1.5s: Capture Photo 1
    timersRef.current.push(
      window.setTimeout(() => {
        triggerShutterFlash();
        const f1 = captureFrame();
        if (f1) {
          capturedList.push(f1);
          setPhotoShots([...capturedList]);
        }
        setCountdown(null);
      }, 1500)
    );

    // 2.2s: Countdown 2
    timersRef.current.push(
      window.setTimeout(() => {
        setShotNumber(2);
        setCountdown('2');
        setPromptText(prompts[1]);
      }, 2200)
    );

    // 2.9s: Capture Photo 2
    timersRef.current.push(
      window.setTimeout(() => {
        triggerShutterFlash();
        const f2 = captureFrame();
        if (f2) {
          capturedList.push(f2);
          setPhotoShots([...capturedList]);
        }
        setCountdown(null);
      }, 2900)
    );

    // 3.6s: Countdown 1
    timersRef.current.push(
      window.setTimeout(() => {
        setShotNumber(3);
        setCountdown('1');
        setPromptText(prompts[2]);
      }, 3600)
    );

    // 4.2s: Capture Photo 3
    timersRef.current.push(
      window.setTimeout(() => {
        triggerShutterFlash();
        const f3 = captureFrame();
        if (f3) {
          capturedList.push(f3);
          setPhotoShots([...capturedList]);
        }
        setCountdown(null);
        setPromptText('CREATING PHOTOBOOTH ✨');
      }, 4200)
    );

    // 4.9s: Animate and transition to Result Screen
    timersRef.current.push(
      window.setTimeout(() => {
        stopStream();
        setCameraState('result');
      }, 4900)
    );
  };

  const startPhotoBoothSession = () => {
    clearTimers();
    setCameraState('boothPrep');
    setPromptText('GET READY...');
    setCountdown(5);
    [4, 3, 2, 1].forEach((number, index) => {
      timersRef.current.push(window.setTimeout(() => setCountdown(number), (index + 1) * 1000));
    });
    timersRef.current.push(window.setTimeout(() => {
      setCountdown(null);
      runPhotoBoothSession();
    }, 5000));
  };

  // Retake restarts the camera and allows another session
  const handleRetake = () => {
    clearTimers();
    setPhotoShots([]);
    setShotNumber(0);
    setPromptText('');
    setCountdown(null);
    openCamera(facingMode);
  };

  // Gift unlock flow transition
  const beginGiftFlow = () => {
    clearTimers();
    setCameraState('countdown');
    setPromptText('PHOTO LOCKED.');
    timersRef.current.push(window.setTimeout(() => setPromptText('YOUR GIFT IS UNLOCKING...'), 1200));
    timersRef.current.push(window.setTimeout(() => setCountdown(3), 2000));
    timersRef.current.push(window.setTimeout(() => setCountdown(2), 2800));
    timersRef.current.push(window.setTimeout(() => setCountdown(1), 3600));
    timersRef.current.push(
      window.setTimeout(() => {
        setCountdown(null);
        setCameraState('burst');
      }, 4400)
    );
    timersRef.current.push(
      window.setTimeout(() => {
        setCameraState('revealed');
        stopStream();
        onReveal?.();
      }, 4400 + config.giftBurstDuration)
    );
  };

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (cameraState === 'idle') return;
      if (event.key === 'Escape') closeCamera();
      if (event.key.toLowerCase() === 'f' && cameraState === 'ready') flipCamera();
      if (event.code === 'Space' && cameraState === 'ready') {
        event.preventDefault();
        startPhotoBoothSession();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [cameraState, facingMode]);

  useEffect(() => () => {
    clearTimers();
    stopStream();
  }, [stopStream]);

  const isOpen = cameraState !== 'idle';

  return (
    <section id="gift-cam" className="section cameraSection">
      <h2>YOUR GIFT CAM</h2>
      <p>{config.messages.camera}</p>
      <button className="primary openGiftCam" type="button" onClick={() => openCamera('user')}>
        OPEN GIFT CAM ↗
      </button>

      {isOpen &&
        createPortal(
          <div
            className={`cameraExperience state-${cameraState}`}
            role="dialog"
            aria-modal="true"
            aria-label="Rakhi Digital Photobooth"
          >
            {/* Modal Header */}
            <header className="cameraHeader">
              <div>
                <span className="cameraEyebrow">RAKHI '26 / DIGITAL PHOTOBOOTH</span>
                <h3>{cameraState === 'result' ? 'PHOTOBOOTH RESULT' : 'YOUR GIFT CAM'}</h3>
                <p>
                  {cameraState === 'result'
                    ? '3 shots captured · Customise & download below'
                    : '3-shot automatic session · 5 seconds'}
                </p>
              </div>
              <button type="button" onClick={closeCamera} aria-label="Close camera">
                ×
              </button>
            </header>

            {/* Requesting State */}
            {cameraState === 'requesting' && (
              <div className="cameraLoading">
                <span className="loaderRing" />
                <span>STARTING DIGITAL PHOTOBOOTH...</span>
              </div>
            )}

            {/* Camera Error / Fallback State */}
            {cameraState === 'error' && (
              <div className="cameraFallback">
                <strong>CAMERA IS BEING SHY 👀</strong>
                <span>Permission required or camera unavailable on this device.</span>
                <div className="cameraFallbackActions">
                  <button className="secondaryActionBtn" type="button" onClick={() => openCamera(facingMode)}>
                    TRY AGAIN ↻
                  </button>
                  <button className="primary" type="button" onClick={beginGiftFlow}>
                    CONTINUE TO GIFT FLOW →
                  </button>
                </div>
              </div>
            )}

            {/* Live Camera Viewfinder & 3-Shot Runner */}
            {(cameraState === 'ready' || cameraState === 'session' || cameraState === 'boothPrep') && (
              <div className="cameraStage">
                <div className="cameraViewport magicViewport">
                  <video
                    ref={videoRef}
                    playsInline
                    autoPlay
                    muted
                    className={facingMode === 'user' ? 'mirrored' : ''}
                  />

                  {/* Shutter Flash effect */}
                  {flash && <span className="photoFlash" aria-hidden="true" />}

                  {/* Clean in-camera HUD overlay */}
                  <CameraOverlay
                    shotNumber={shotNumber}
                    totalShots={3}
                    countdown={countdown}
                    promptText={promptText}
                    isSessionActive={cameraState === 'session'}
                  />
                </div>

                {/* Viewfinder Controls — flip only, no zoom */}
                <div className="cameraActions cameraActionsWithZoom">
                  <button className="cameraZoomBtn" type="button" onClick={() => setCameraZoom(0.5)} disabled={!zoomRange || cameraState !== 'ready'} aria-label="Use 0.5 times camera zoom">0.5x</button>
                  <button className={`cameraZoomBtn ${zoom >= 0.95 ? 'active' : ''}`} type="button" onClick={() => setCameraZoom(1)} disabled={!zoomRange || cameraState !== 'ready'} aria-label="Use 1 times camera zoom">1x</button>
                  <button
                    className="roundControl flipBtn"
                    type="button"
                    onClick={flipCamera}
                    disabled={cameraState === 'session'}
                    aria-label="Flip front or back camera"
                  >
                    ↻
                  </button>
                </div>

                {/* Main Launch Button */}
                {cameraState === 'boothPrep' && <div className="boothPrepOverlay" aria-live="polite"><span>GET READY...</span><strong>{countdown}</strong><small>Your 5-second photobooth starts next</small></div>}
                {cameraState === 'ready' && (
                  <button
                    className="primary startBoothBtn"
                    type="button"
                    onClick={startPhotoBoothSession}
                  >
                    START PHOTOBOOTH ✨
                  </button>
                )}

                <p className="cameraHint">
                  {cameraState === 'session'
                    ? promptText || 'Pose for the camera!'
                    : '1 tap = 3 automatic photos in 5 seconds.'}
                </p>
              </div>
            )}

            {/* Photobooth Result Stage */}
            {cameraState === 'result' && (
              <div className="cameraStage resultStage animate-fade-in">
                <PhotoBooth
                  photos={photoShots}
                  onRetake={handleRetake}
                  onUse={beginGiftFlow}
                />
              </div>
            )}

            {/* Gift Reveal Sequence (if continued) */}
            {(cameraState === 'countdown' || cameraState === 'burst' || cameraState === 'revealed') && (
              <div className="cameraStage">
                <div className="lockedPhoto">
                  {photoShots[0] && <img src={photoShots[0]} alt="Your locked Rakhi moment" />}
                  <span className="lockScan" />
                </div>
                <div className="flowMessage">{countdown || promptText}</div>
              </div>
            )}

            {cameraState === 'burst' && <GiftBurst active />}
          </div>,
          document.body
        )}
    </section>
  );
}

export default GiftCamera;
