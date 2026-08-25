import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import usePhotoSource from '../hooks/usePhotoSource';

function PhotoLightbox({ photos, index, onClose, onChange }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') onChange(-1);
      if (event.key === 'ArrowRight') onChange(1);
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handleKeyDown); document.body.style.overflow = ''; };
  }, [onChange, onClose]);

  const photo = photos[index];
  const displaySource = usePhotoSource(photo.src);
  return createPortal(
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo memory">
      <button className="closeButton" type="button" onClick={onClose} aria-label="Close photo">×</button>
      <button className="lightboxArrow lightboxPrev" type="button" onClick={() => onChange(-1)} aria-label="Previous photo">←</button>
      <div className="lightboxContent">
        <div className="lightboxImageWrap">
          {displaySource && <img src={displaySource} alt={photo.alt} onError={(event) => { event.currentTarget.style.display = 'none'; }} />}
          <span className="assetFallback">memory<br />{String(index + 1).padStart(2, '0')}</span>
        </div>
        <small>{String(index + 1).padStart(2, '0')} / {photos.length}</small>
      </div>
      <button className="lightboxArrow lightboxNext" type="button" onClick={() => onChange(1)} aria-label="Next photo">→</button>
    </div>,
    document.body
  );
}

export default PhotoLightbox;
