import { siteConfig } from '../config/config';
import { useState } from 'react';
import PhotoCard from './PhotoCard';
import PhotoLightbox from './PhotoLightbox';

function PhotoWall() {
  const [selected, setSelected] = useState(null);
  const changePhoto = (direction) => setSelected((current) => (current + direction + siteConfig.photos.length) % siteConfig.photos.length);

  return (
    <section id="photos" className="section">
      <h2>Us ♡</h2>
      <p>little pieces of chaos, memories &amp; good vibes.</p>
      <div className="photoGrid">
        {siteConfig.photos.map((photo, index) => <PhotoCard key={photo.src} photo={photo} index={index} onSelect={setSelected} />)}
      </div>
      {selected !== null && <PhotoLightbox photos={siteConfig.photos} index={selected} onClose={() => setSelected(null)} onChange={changePhoto} />}
    </section>
  );
}

export default PhotoWall;
