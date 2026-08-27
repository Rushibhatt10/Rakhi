import { createPortal } from 'react-dom';
import config, { assetUrl } from '../config/config';

const chocolateBurst = Array.from({ length: 50 }, (_, index) => index);

function GiftBurst({ active }) {
  if (!active) return null;
  const burstItems = chocolateBurst.slice(0, config.giftBurstQuantity);
  const burst = (
    <div className="giftBurst" style={{ '--burst-duration': `${config.giftBurstDuration}ms` }} aria-hidden="true">
      {burstItems.map((index) => {
        const angle = (index / burstItems.length) * Math.PI * 2 + (index % 5) * 0.11;
        const distance = 22 + (index % 7) * 3.2;
        const x = `${Math.cos(angle) * distance}vw`;
        const y = `${Math.sin(angle) * distance * 0.82}vh`;
        const rotation = `${(index * 47) % 720 - 360}deg`;
        const delay = `${(index % 8) * 0.035}s`;
        const duration = `${5.1 + (index % 5) * 0.16}s`;
        const scale = (0.86 + (index % 6) * 0.07).toFixed(2);
        const giftSource = assetUrl(index % 2 === 0 ? 'gifts/500.png' : 'gifts/dm.png');
        return (
          <div className="giftObject" key={index} style={{ '--x': x, '--y': y, '--r': rotation, '--gift-delay': delay, '--gift-duration': duration, '--gift-scale': scale }}>
            <img src={giftSource} alt="" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
          </div>
        );
      })}
    </div>
  );
  return createPortal(burst, document.body);
}

export default GiftBurst;
