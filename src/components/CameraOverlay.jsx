function CameraOverlay({ magic, status, presence }) {
  return (
    <div className={`cameraOverlay ${magic ? 'magicOn' : ''}`} aria-hidden="true">
      <span className="cameraBrand">RAKHI '26</span>
      <span className="cameraCoordinates">28° 36' N<br />77° 13' E</span>
      <span className="cameraStatus">{status}</span>
      <span className="presenceText">{presence}</span>
      <span className="trackingDot dotOne" /><span className="trackingDot dotTwo" /><span className="trackingDot dotThree" />
      <span className="corner cornerTopLeft" /><span className="corner cornerTopRight" /><span className="corner cornerBottomLeft" /><span className="corner cornerBottomRight" />
      <span className="sparkle sparkleOne">✦</span><span className="sparkle sparkleTwo">✧</span><span className="sparkle sparkleThree">✦</span>
    </div>
  );
}

export default CameraOverlay;
