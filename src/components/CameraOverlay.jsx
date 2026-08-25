import React from 'react';

function CameraOverlay({
  shotNumber = 0,
  totalShots = 3,
  countdown = null,
  promptText = '',
  isSessionActive = false,
}) {
  return (
    <div className="cameraOverlay" aria-hidden="true">
      {/* Corner framing brackets */}
      <span className="corner cornerTopLeft" />
      <span className="corner cornerTopRight" />
      <span className="corner cornerBottomLeft" />
      <span className="corner cornerBottomRight" />

      {/* Top branding and Shot progress */}
      <div className="boothHudTop">
        <span className="cameraBrand">RAKHI '26 / PHOTOBOOTH</span>
        {isSessionActive && (
          <div className="shotCounter">
            <span className="shotText">
              SHOT {shotNumber > 0 ? shotNumber : 1} / {totalShots}
            </span>
            <div className="shotDots">
              {[1, 2, 3].map((num) => (
                <span
                  key={num}
                  className={`shotDot ${shotNumber >= num ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Active Pose Prompt Bubble */}
      {isSessionActive && promptText && (
        <div className="boothPromptBanner animate-slide-down">
          <span className="promptEmoji">✨</span>
          <span className="promptText">{promptText}</span>
        </div>
      )}

      {/* Center Countdown Pulse */}
      {countdown !== null && (
        <div className="boothCountdownOverlay" key={countdown}>
          <div className="countdownNumber animate-pop-in">{countdown}</div>
        </div>
      )}

      {/* Subtle bottom telemetry */}
      <div className="boothHudBottom">
        <span className="cameraStatus">
          {isSessionActive ? '● RECORDING SHOTS' : '● READY'}
        </span>
        <span className="presenceText">3-SHOT DIGITAL BOOTH</span>
      </div>

      {/* Subtle sparkling decorative accents */}
      <span className="sparkle sparkleOne">✦</span>
      <span className="sparkle sparkleTwo">✧</span>
    </div>
  );
}

export default CameraOverlay;
