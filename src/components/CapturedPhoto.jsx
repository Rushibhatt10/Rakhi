function CapturedPhoto({ source, onRetake, onUse }) {
  return (
    <div className="capturedScreen">
      <div className="capturedPhotoCard">
        <img src={source} alt="Your captured Rakhi moment" />
        <span className="capturedStamp">RAKHI '26 / JUST NOW</span>
      </div>
      <h3>LOOKS GOOD. ♡</h3>
      <div className="capturedActions">
        <button type="button" onClick={onRetake}>RETAKE</button>
        <button className="primary" type="button" onClick={onUse}>USE THIS</button>
      </div>
    </div>
  );
}

export default CapturedPhoto;
