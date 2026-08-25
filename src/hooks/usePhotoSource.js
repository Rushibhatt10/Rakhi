import { useEffect, useState } from 'react';

function usePhotoSource(source) {
  const [displaySource, setDisplaySource] = useState(source);

  useEffect(() => {
    let objectUrl;
    const isHeic = /\.heic$/i.test(source);
    if (!isHeic) { setDisplaySource(source); return undefined; }

    setDisplaySource(null);
    fetch(source)
      .then((response) => response.blob())
      .then((blob) => import('heic2any').then(({ default: heic2any }) => heic2any({ blob, toType: 'image/jpeg', quality: 0.88 })))
      .then((converted) => {
        objectUrl = URL.createObjectURL(Array.isArray(converted) ? converted[0] : converted);
        setDisplaySource(objectUrl);
      })
      .catch(() => setDisplaySource(null));

    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [source]);

  return displaySource;
}

export default usePhotoSource;