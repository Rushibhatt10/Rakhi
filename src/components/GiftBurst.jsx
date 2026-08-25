import config, { assetUrl } from '../config/config';

const chocolateBurst = Array.from({ length: 50 }, (_, index) => index);

function GiftBurst({ active }) {
  if (!active) return null;
  const burstItems = chocolateBurst.slice(0, config.giftBurstQuantity);
  return (
    <div className="giftBurst" style={{ '--burst-duration': `${config.giftBurstDuration}ms` }} aria-hidden="true">
      {burstItems.map((index) => {
        const angle = (index / burstItems.length) * Math.PI * 2 + (index % 7) * 0.17;
        const distance = 58 + (index % 11) * 7;
        const x = `${Math.cos(angle) * distance * 1.22}vw`;
        const y = `${Math.sin(angle) * distance * 1.12}vh`;
        const rotation = `${(index * 47) % 360 - 180}deg`;
        const delay = `${(index % 12) * 0.22}s`;
        const duration = `${18 + (index % 9) * 0.9}s`;
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
