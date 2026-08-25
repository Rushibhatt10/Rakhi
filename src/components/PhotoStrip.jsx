import { useEffect, useRef, useState } from 'react';
import config from '../config/config';

const themes = {
  pink: ['#241126', '#ff8bc9', '#8bf5ff'], lavender: ['#15132d', '#c69cff', '#8bf5ff'],
  peach: ['#321a1b', '#ffb08d', '#ffe2a8'], mono: ['#111', '#fff', '#aaa'], candy: ['#32124a', '#ff8bc9', '#8bf5ff'],
};
const filters = { original: 'none', warm: 'sepia(.35) saturate(1.35)', cool: 'saturate(.8) hue-rotate(20deg)', bw: 'grayscale(1)', glow: 'saturate(1.2) brightness(1.08)' };

function PhotoStrip({ photos, onRetake, onUse }) {
  const canvasRef = useRef(null);
  const [name, setName] = useState(config.photoBoothConfig.defaultName);
  const [date, setDate] = useState(new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase());
  const [message, setMessage] = useState(config.photoBoothConfig.defaultMessage);
  const [layout, setLayout] = useState('classic');
  const [theme, setTheme] = useState('pink');
  const [filter, setFilter] = useState('original');
  const [stripUrl, setStripUrl] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const images = photos.map((source) => new Promise((resolve) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = () => resolve(null); image.src = source; }));
    Promise.all(images).then((loaded) => {
      if (cancelled) return;
      const horizontal = layout === 'horizontal';
      const width = horizontal ? 1800 : 1200;
      const height = horizontal ? 1050 : 1800;
      canvas.width = width; canvas.height = height;
      const colors = themes[theme];
      const gradient = context.createLinearGradient(0, 0, width, height); gradient.addColorStop(0, colors[0]); gradient.addColorStop(1, '#100d18'); context.fillStyle = gradient; context.fillRect(0, 0, width, height);
      context.fillStyle = colors[1]; context.font = '800 64px sans-serif'; context.fillText("RAKHI '26 ♡", 70, 110);
      context.fillStyle = colors[2]; context.font = '500 24px monospace'; context.fillText(name || 'YOUR NAME', 74, 158);
      loaded.forEach((image, index) => {
        const x = horizontal ? 70 + index * 570 : layout === 'editorial' ? (index === 0 ? 70 : 650) : 70;
        const y = horizontal ? 250 : layout === 'editorial' ? (index === 0 ? 250 : 820 + (index - 1) * 430) : 230 + index * 500;
        const photoWidth = horizontal ? 500 : layout === 'editorial' && index > 0 ? 480 : 1060;
        const photoHeight = horizontal ? 650 : layout === 'editorial' && index > 0 ? 360 : 440;
        context.save(); context.shadowColor = 'rgba(0,0,0,.45)'; context.shadowBlur = 28; context.fillStyle = '#fff9fb'; context.fillRect(x - 14, y - 14, photoWidth + 28, photoHeight + 28); context.restore();
        if (image) { context.save(); context.beginPath(); context.rect(x, y, photoWidth, photoHeight); context.clip(); context.filter = filters[filter]; const scale = Math.min(photoWidth / image.width, photoHeight / image.height); const dw = image.width * scale; const dh = image.height * scale; context.drawImage(image, x + (photoWidth - dw) / 2, y + (photoHeight - dh) / 2, dw, dh); context.restore(); }
        context.fillStyle = colors[2]; context.font = '500 20px monospace'; context.fillText(`PHOTO 0${index + 1}`, x, y + photoHeight + 48);
      });
      context.fillStyle = colors[1]; context.font = '700 34px sans-serif'; context.fillText(message || 'good vibes only ♡', 74, height - 120);
      context.fillStyle = colors[2]; context.font = '500 24px monospace'; context.fillText(date, width - 330, height - 120);
      setStripUrl(canvas.toDataURL('image/png'));
    });
    return () => { cancelled = true; };
  }, [date, filter, layout, message, name, photos, theme]);

  const download = () => { if (!stripUrl) return; const link = document.createElement('a'); link.href = stripUrl; link.download = `rakhi-26-${(name || 'photobooth').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-photobooth.png`; link.click(); setSaved(true); };
  const options = (label, value, values, setter) => <label className="stripSelect">{label}<select value={value} onChange={(event) => setter(event.target.value)}>{values.map((item) => <option key={item} value={item}>{item.toUpperCase()}</option>)}</select></label>;

  return <div className="photoStripScreen"><div className="photoStripPreview"><canvas ref={canvasRef} aria-label="Three-photo photobooth result" /></div><h3>YOUR PHOTOBOOTH ♡</h3><div className="stripFields"><label>Name<input value={name} onChange={(event) => setName(event.target.value)} maxLength={24} /></label><label>Date<input value={date} onChange={(event) => setDate(event.target.value)} maxLength={24} /></label><label>Message<input value={message} onChange={(event) => setMessage(event.target.value)} maxLength={44} /></label></div><div className="stripChoices">{options('Layout', layout, config.photoBoothConfig.layouts, setLayout)}{options('Theme', theme, config.photoBoothConfig.themes, setTheme)}{options('Filter', filter, config.photoBoothConfig.filters, setFilter)}</div><div className="capturedActions"><button type="button" onClick={onRetake}>RETAKE</button><button type="button" onClick={download} disabled={!stripUrl}>{saved ? 'SAVED ✓' : 'DOWNLOAD PHOTOBOOTH ↗'}</button><button className="primary" type="button" onClick={onUse}>USE THIS</button></div></div>;
}

export default PhotoStrip;
