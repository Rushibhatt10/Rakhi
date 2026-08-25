import React, { useState } from 'react';
import config from '../config/config';
import PhotoBoothPreview from './PhotoBoothPreview';
import PhotoBoothEditor from './PhotoBoothEditor';

function PhotoBooth({ photos = [], onRetake, onUse }) {
  const [name, setName] = useState(config.photoBoothConfig.defaultName || 'Rushi');
  const [message, setMessage] = useState(
    config.photoBoothConfig.defaultMessage || 'good vibes only ♡'
  );
  const [date, setDate] = useState(() =>
    new Date()
      .toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      })
      .toUpperCase()
  );
  const [layout, setLayout] = useState('classic');
  const [theme, setTheme] = useState('pink');
  const [filter, setFilter] = useState('original');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [canvasElement, setCanvasElement] = useState(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDataUrlReady = (url, canvas) => {
    setDownloadUrl(url);
    setCanvasElement(canvas);
  };

  const handleDownload = () => {
    if (!canvasElement && !downloadUrl) return;

    const safeName = (name.trim() || 'photobooth')
      .replace(/[^a-z0-9_-]/gi, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase();
    const fileName = `rakhi-26-${safeName}-photobooth.png`;

    if (canvasElement && canvasElement.toBlob) {
      canvasElement.toBlob(
        (blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(url), 1000);
          setDownloadSuccess(true);
          setTimeout(() => setDownloadSuccess(false), 3000);
        },
        'image/png',
        0.98
      );
    } else if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }
  };

  return (
    <div className="photoboothResultScreen">
      {/* Title */}
      <div className="photoboothHeading">
        <span className="boothPill">✨ MEMORY UNLOCKED</span>
        <h3>YOUR PHOTOBOOTH ♡</h3>
        <p>Customise your 3-shot strip and save high-res!</p>
      </div>

      <div className="photoboothMainGrid">
        {/* Left/Top: Live Canvas Composition */}
        <div className="photoboothPreviewCol">
          <PhotoBoothPreview
            photos={photos}
            layout={layout}
            theme={theme}
            filter={filter}
            name={name}
            date={date}
            message={message}
            onDataUrlReady={handleDataUrlReady}
          />
        </div>

        {/* Right/Bottom: Controls & Customization */}
        <div className="photoboothControlsCol">
          <PhotoBoothEditor
            name={name}
            setName={setName}
            message={message}
            setMessage={setMessage}
            date={date}
            setDate={setDate}
            layout={layout}
            setLayout={setLayout}
            theme={theme}
            setTheme={setTheme}
            filter={filter}
            setFilter={setFilter}
          />

          {/* Action Bar */}
          <div className="photoboothActionGroup">
            <button
              type="button"
              className="primary downloadActionBtn"
              onClick={handleDownload}
              disabled={!downloadUrl}
            >
              {downloadSuccess ? '✓ PHOTOBOOTH SAVED!' : '📥 DOWNLOAD PHOTOBOOTH ↗'}
            </button>

            <div className="secondaryActionRow">
              <button
                type="button"
                className="secondaryActionBtn"
                onClick={onRetake}
                aria-label="Retake photos"
              >
                ↻ RETAKE SHOTS
              </button>

              {onUse && (
                <button
                  type="button"
                  className="secondaryActionBtn giftUnlockAction"
                  onClick={onUse}
                >
                  UNLOCK GIFT 🎁 →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhotoBooth;

