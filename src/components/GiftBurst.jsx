import config, { assetUrl } from '../config/config';

const chocolateBurst = Array.from({ length: 36 }, (_, index) => index);

function GiftBurst({ active }) {
  if (!active) return null;
  const burstItems = chocolateBurst.slice(0, config.giftBurstQuantity);
  return (
    <div className="giftBurst" style={{ '--burst-duration': `${config.giftBurstDuration}ms` }} aria-hidden="true">
      {burstItems.map((index) => {
        const angle = (index / burstItems.length) * Math.PI * 2 + (index % 7) * 0.17;
        const distance = 24 + (index % 9) * 5;
        const x = `${Math.cos(angle) * distance * 1.35}vw`;
        const y = `${Math.sin(angle) * distance * 1.25}vh`;
        const rotation = `${(index * 47) % 360 - 180}deg`;
        const delay = `${(index % 9) * 0.06}s`;
        const duration = `${3.2 + (index % 6) * 0.35}s`;
        const giftSource = assetUrl(index % 2 === 0 ? 'gifts/500.png' : 'gifts/dm.png');
        return (
          <div className="giftObject" key={index} style={{ '--x': x, '--y': y, '--r': rotation, '--gift-delay': delay, '--gift-duration': duration }}>
            <img src={giftSource} alt="" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
          </div>
        );
      })}
    </div>
  );
}

export default GiftBurst;
