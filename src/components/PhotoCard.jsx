import usePhotoSource from '../hooks/usePhotoSource';

function PhotoCard({ photo, index, onSelect }) {
  const displaySource = usePhotoSource(photo.src);
  return (
    <button
      className={`photoCard photoCard-${index % 6}`}
      type="button"
      onClick={() => onSelect(index)}
      aria-label={`Open memory ${index + 1}`}
    >
      <span className="photoImageWrap">
        {displaySource && <img
          src={displaySource}
          alt={photo.alt}
          loading="lazy"
          onError={(event) => { event.currentTarget.style.display = 'none'; }}
        />}
        <span className="assetFallback">memory<br />{String(index + 1).padStart(2, '0')}</span>
      </span>
    </button>
  );
}

export default PhotoCard;
