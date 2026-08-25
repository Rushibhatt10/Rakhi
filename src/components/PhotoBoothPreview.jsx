import { useEffect, useRef, useState } from 'react';
import config from '../config/config';

const themePalette = {
  pink: {
    bgGrad: ['#23092b', '#100517'],
    border: '#ff2e93',
    accent: '#00f5ff',
    title: '#ff4da6',
    subText: '#ffb3db',
    cardBg: '#ffffff',
    photoBorder: '#ff66b2',
    stamp: '#00f5ff',
  },
  lavender: {
    bgGrad: ['#18103d', '#0a071c'],
    border: '#c084fc',
    accent: '#00f5ff',
    title: '#d8b4fe',
    subText: '#e9d5ff',
    cardBg: '#ffffff',
    photoBorder: '#c084fc',
    stamp: '#00f5ff',
  },
  peach: {
    bgGrad: ['#301518', '#140608'],
    border: '#ff7a45',
    accent: '#ffd166',
    title: '#ff9a70',
    subText: '#ffd8cc',
    cardBg: '#ffffff',
    photoBorder: '#ff7a45',
    stamp: '#ffd166',
  },
  mono: {
    bgGrad: ['#121216', '#050507'],
    border: '#ffffff',
    accent: '#00f5ff',
    title: '#ffffff',
    subText: '#cbd5e1',
    cardBg: '#ffffff',
    photoBorder: '#ffffff',
    stamp: '#00f5ff',
  },
  candy: {
    bgGrad: ['#2d0745', '#0e021a'],
    border: '#ff389d',
    accent: '#06b6d4',
    title: '#f472b6',
    subText: '#fbcfe8',
    cardBg: '#ffffff',
    photoBorder: '#06b6d4',
    stamp: '#ff389d',
  },
};

const filterStyles = {
  original: 'none',
  warm: 'sepia(0.28) saturate(1.3) contrast(1.05)',
  cool: 'saturate(0.9) hue-rotate(15deg) contrast(1.05)',
  bw: 'grayscale(1) contrast(1.2)',
  glow: 'saturate(1.25) brightness(1.08) contrast(1.05)',
};

function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawBarcode(ctx, x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
  const barPattern = [3, 2, 6, 2, 4, 3, 2, 5, 2, 7, 3, 2, 5, 4, 2, 3, 6, 2, 4, 2, 5, 3];
  let curX = x + 8;
  const total = barPattern.reduce((a, b) => a + b, 0);
  const scale = (width - 16) / total;
  barPattern.forEach((w, idx) => {
    if (idx % 2 === 0) {
      ctx.fillStyle = color;
      ctx.fillRect(curX, y, w * scale, height);
    }
    curX += w * scale;
  });
}

function PhotoBoothPreview({
  photos = [],
  layout = 'classic',
  theme = 'pink',
  filter = 'original',
  name = '',
  date = '',
  message = '',
  onDataUrlReady = null,
}) {
  const canvasRef = useRef(null);
  const [dataUrl, setDataUrl] = useState(null);
  const [rendering, setRendering] = useState(true);

  useEffect(() => {
    let active = true;
    setRendering(true);
    const canvas = canvasRef.current;
    if (!canvas || photos.length === 0) return;
    const ctx = canvas.getContext('2d');

    // Load all 3 photos as Image objects
    const loadPromises = photos.map((src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });
    });

    Promise.all(loadPromises).then((images) => {
      if (!active) return;
      const t = themePalette[theme] || themePalette.pink;

      // Set canvas dimension based on Layout
      let W = 1200;
      let H = 1800;
      if (layout === 'horizontal') {
        W = 1800;
        H = 1100;
      } else if (layout === 'editorial') {
        W = 1400;
        H = 1800;
      }
      canvas.width = W;
      canvas.height = H;

      // 1. Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, W, H);
      bgGrad.addColorStop(0, t.bgGrad[0]);
      bgGrad.addColorStop(1, t.bgGrad[1]);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // 2. Subtle frame border & film dots
      ctx.strokeStyle = t.border;
      ctx.lineWidth = 4;
      drawRoundedRect(ctx, 24, 24, W - 48, H - 48, 28);
      ctx.stroke();

      // Film punch holes / corner markers
      ctx.fillStyle = t.accent;
      ctx.beginPath();
      ctx.arc(48, 48, 6, 0, Math.PI * 2);
      ctx.arc(W - 48, 48, 6, 0, Math.PI * 2);
      ctx.arc(48, H - 48, 6, 0, Math.PI * 2);
      ctx.arc(W - 48, H - 48, 6, 0, Math.PI * 2);
      ctx.fill();

      // LAYOUT SPECIFIC DRAWING
      if (layout === 'classic') {
        // --- CLASSIC VERTICAL STRIP (Korean / Instagram Photobooth style) ---
        // Header
        ctx.fillStyle = t.title;
        ctx.font = '900 68px "Manrope", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("RAKHI '26 ♡", W / 2, 110);

        ctx.fillStyle = t.stamp;
        ctx.font = '600 20px "DM Mono", monospace';
        ctx.letterSpacing = '4px';
        ctx.fillText('✦ DIGITAL PHOTOBOOTH // 3-SHOT SERIES ✦', W / 2, 150);

        // 3 Vertical Photos
        const photoW = W - 140; // 1060
        const photoH = 430;
        const startY = 190;
        const gap = 34;

        images.forEach((img, idx) => {
          const py = startY + idx * (photoH + gap);
          const px = 70;

          // Polaroid Card backing with soft shadow
          ctx.save();
          ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
          ctx.shadowBlur = 24;
          ctx.shadowOffsetY = 10;
          ctx.fillStyle = t.cardBg;
          drawRoundedRect(ctx, px, py, photoW, photoH, 18);
          ctx.fill();
          ctx.restore();

          // Border
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.lineWidth = 2;
          drawRoundedRect(ctx, px, py, photoW, photoH, 18);
          ctx.stroke();

          // Draw Photo
          if (img) {
            ctx.save();
            drawRoundedRect(ctx, px + 8, py + 8, photoW - 16, photoH - 16, 14);
            ctx.clip();
            ctx.filter = filterStyles[filter] || 'none';
            // Aspect crop
            const targetRatio = (photoW - 16) / (photoH - 16);
            const imgRatio = img.width / img.height;
            let sx, sy, sw, sh;
            if (imgRatio > targetRatio) {
              sh = img.height;
              sw = img.height * targetRatio;
              sx = (img.width - sw) / 2;
              sy = 0;
            } else {
              sw = img.width;
              sh = img.width / targetRatio;
              sx = 0;
              sy = (img.height - sh) / 2;
            }
            ctx.drawImage(img, sx, sy, sw, sh, px + 8, py + 8, photoW - 16, photoH - 16);
            ctx.restore();
          }

          // Frame tag
          ctx.fillStyle = t.border;
          ctx.font = '700 16px "DM Mono", monospace';
          ctx.textAlign = 'left';
          ctx.fillText(`SHOT 0${idx + 1} ✦`, px + 22, py + photoH - 20);

          ctx.textAlign = 'right';
          ctx.fillText("RAKHI '26", px + photoW - 22, py + photoH - 20);
        });

        // Footer Text Section
        const footerY = H - 120;
        ctx.fillStyle = t.accent;
        ctx.font = '700 24px "DM Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(name ? `BY: ${name.toUpperCase()} ✨` : 'RAKHI MOMENT ✨', 74, footerY);

        ctx.fillStyle = t.title;
        ctx.font = '800 32px "Manrope", sans-serif';
        ctx.fillText(`"${message || 'good vibes only ♡'}"`, 74, footerY + 45);

        ctx.fillStyle = t.subText;
        ctx.font = '600 20px "DM Mono", monospace';
        ctx.textAlign = 'right';
        ctx.fillText(date || 'AUG 2026', W - 74, footerY);

        drawBarcode(ctx, W - 220, footerY + 16, 146, 32, t.border);
      } else if (layout === 'horizontal') {
        // --- HORIZONTAL WIDE CARD ---
        // Header
        ctx.fillStyle = t.title;
        ctx.font = '900 60px "Manrope", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText("RAKHI '26 ♡", 70, 100);

        ctx.fillStyle = t.accent;
        ctx.font = '600 22px "DM Mono", monospace';
        ctx.textAlign = 'right';
        ctx.fillText(date || 'AUG 2026', W - 70, 75);

        ctx.fillStyle = t.subText;
        ctx.fillText(name ? `FOR ${name.toUpperCase()}` : 'SPECIAL EDITION', W - 70, 105);

        // 3 Side-by-Side Photos
        const photoW = 500;
        const photoH = 700;
        const startX = 85;
        const gap = 65;
        const startY = 160;

        images.forEach((img, idx) => {
          const px = startX + idx * (photoW + gap);
          const py = startY;

          // Polaroid Card backing
          ctx.save();
          ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
          ctx.shadowBlur = 24;
          ctx.shadowOffsetY = 10;
          ctx.fillStyle = t.cardBg;
          drawRoundedRect(ctx, px, py, photoW, photoH, 20);
          ctx.fill();
          ctx.restore();

          if (img) {
            ctx.save();
            drawRoundedRect(ctx, px + 10, py + 10, photoW - 20, photoH - 65, 16);
            ctx.clip();
            ctx.filter = filterStyles[filter] || 'none';
            const targetRatio = (photoW - 20) / (photoH - 65);
            const imgRatio = img.width / img.height;
            let sx, sy, sw, sh;
            if (imgRatio > targetRatio) {
              sh = img.height;
              sw = img.height * targetRatio;
              sx = (img.width - sw) / 2;
              sy = 0;
            } else {
              sw = img.width;
              sh = img.width / targetRatio;
              sx = 0;
              sy = (img.height - sh) / 2;
            }
            ctx.drawImage(img, sx, sy, sw, sh, px + 10, py + 10, photoW - 20, photoH - 65);
            ctx.restore();
          }

          // Card caption on bottom white margin
          ctx.fillStyle = '#100d18';
          ctx.font = '700 18px "DM Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`MOMENT 0${idx + 1} ♡`, px + photoW / 2, py + photoH - 22);
        });

        // Bottom Banner
        ctx.fillStyle = t.title;
        ctx.font = '800 36px "Manrope", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`"${message || 'good vibes only ♡'}"`, W / 2, H - 100);

        ctx.fillStyle = t.stamp;
        ctx.font = '600 18px "DM Mono", monospace';
        ctx.fillText('✦ MEMORY CAPTURED WITH LOVE ✦', W / 2, H - 55);
      } else {
        // --- EDITORIAL MAGAZINE LAYOUT ---
        // Header
        ctx.fillStyle = t.border;
        ctx.font = '700 20px "DM Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText('RAKHI MAGAZINE // ISSUE 2026', 70, 90);

        ctx.fillStyle = t.title;
        ctx.font = '900 76px "Manrope", sans-serif';
        ctx.fillText('THE VIBE EDIT.', 70, 165);

        ctx.fillStyle = t.accent;
        ctx.font = '600 20px "DM Mono", monospace';
        ctx.textAlign = 'right';
        ctx.fillText(`DATE: ${date || 'AUG 2026'}`, W - 70, 90);
        ctx.fillText(name ? `FEATURE: ${name.toUpperCase()}` : 'FEATURE: SIBLING OF THE YEAR', W - 70, 125);

        // Featured Big Photo on Left
        const mainW = 680;
        const mainH = 1350;
        const mainX = 70;
        const mainY = 210;

        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 30;
        ctx.fillStyle = '#ffffff';
        drawRoundedRect(ctx, mainX, mainY, mainW, mainH, 20);
        ctx.fill();
        ctx.restore();

        if (images[0]) {
          ctx.save();
          drawRoundedRect(ctx, mainX + 10, mainY + 10, mainW - 20, mainH - 70, 16);
          ctx.clip();
          ctx.filter = filterStyles[filter] || 'none';
          const targetRatio = (mainW - 20) / (mainH - 70);
          const imgRatio = images[0].width / images[0].height;
          let sx, sy, sw, sh;
          if (imgRatio > targetRatio) {
            sh = images[0].height;
            sw = images[0].height * targetRatio;
            sx = (images[0].width - sw) / 2;
            sy = 0;
          } else {
            sw = images[0].width;
            sh = images[0].width / targetRatio;
            sx = 0;
            sy = (images[0].height - sh) / 2;
          }
          ctx.drawImage(images[0], sx, sy, sw, sh, mainX + 10, mainY + 10, mainW - 20, mainH - 70);
          ctx.restore();
        }

        ctx.fillStyle = '#100d18';
        ctx.font = '700 20px "DM Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText('FIG 01. MAIN CHARACTER', mainX + 25, mainY + mainH - 24);

        // 2 Stacked Photos on Right
        const sideW = 540;
        const sideH = 580;
        const sideX = 790;
        const sideY1 = 210;
        const sideY2 = 820;

        [images[1], images[2]].forEach((img, idx) => {
          const syPos = idx === 0 ? sideY1 : sideY2;

          ctx.save();
          ctx.shadowColor = 'rgba(0,0,0,0.45)';
          ctx.shadowBlur = 24;
          ctx.fillStyle = '#ffffff';
          drawRoundedRect(ctx, sideX, syPos, sideW, sideH, 20);
          ctx.fill();
          ctx.restore();

          if (img) {
            ctx.save();
            drawRoundedRect(ctx, sideX + 10, syPos + 10, sideW - 20, sideH - 65, 16);
            ctx.clip();
            ctx.filter = filterStyles[filter] || 'none';
            const targetRatio = (sideW - 20) / (sideH - 65);
            const imgRatio = img.width / img.height;
            let sx, sy, sw, sh;
            if (imgRatio > targetRatio) {
              sh = img.height;
              sw = img.height * targetRatio;
              sx = (img.width - sw) / 2;
              sy = 0;
            } else {
              sw = img.width;
              sh = img.width / targetRatio;
              sx = 0;
              sy = (img.height - sh) / 2;
            }
            ctx.drawImage(img, sx, sy, sw, sh, sideX + 10, syPos + 10, sideW - 20, sideH - 65);
            ctx.restore();
          }

          ctx.fillStyle = '#100d18';
          ctx.font = '700 18px "DM Mono", monospace';
          ctx.textAlign = 'left';
          ctx.fillText(`FIG 0${idx + 2}. ICONIC MOMENT`, sideX + 22, syPos + sideH - 22);
        });

        // Editorial Quote Box at bottom right
        const quoteY = 1430;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        drawRoundedRect(ctx, sideX, quoteY, sideW, 130, 16);
        ctx.fill();

        ctx.fillStyle = t.title;
        ctx.font = '800 28px "Manrope", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`"${message || 'good vibes only ♡'}"`, sideX + sideW / 2, quoteY + 55);

        ctx.fillStyle = t.accent;
        ctx.font = '600 16px "DM Mono", monospace';
        ctx.fillText("RAKHI '26 SPECIAL EDITORIAL", sideX + sideW / 2, quoteY + 95);

        // Bottom aesthetic footer
        ctx.fillStyle = t.subText;
        ctx.font = '600 16px "DM Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText('ALL RIGHTS RESERVED ♡ RAKHI CELEBRATION 2026', 70, H - 75);

        drawBarcode(ctx, W - 240, H - 95, 170, 32, t.border);
      }

      const generatedUrl = canvas.toDataURL('image/png', 0.95);
      setDataUrl(generatedUrl);
      setRendering(false);
      onDataUrlReady?.(generatedUrl, canvas);
    });

    return () => {
      active = false;
    };
  }, [photos, layout, theme, filter, name, date, message, onDataUrlReady]);

  return (
    <div className={`photoboothCanvasWrapper layout-${layout} theme-${theme}`}>
      {rendering && (
        <div className="canvasLoadingSpinner">
          <span className="loaderRing" />
          <span>RENDERING HIGH-RES PHOTOBOOTH...</span>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="photoboothCanvas"
        aria-label="High resolution Rakhi photobooth compilation"
      />
    </div>
  );
}

export default PhotoBoothPreview;

