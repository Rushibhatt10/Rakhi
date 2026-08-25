import { siteConfig } from '../config/config';

function GiftReveal({ revealed }) {
  if (!revealed) return null;
  return (
    <section className="section">
      <div className="giftCard">
        <small>YOUR RAKHI GIFT ♡</small>
        <h1>{siteConfig.giftAmount}</h1>
        <p>Because you deserve a little extra today.</p>
      </div>
    </section>
  );
}

export default GiftReveal;
