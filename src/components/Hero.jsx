function Hero({ started, onStart }) {
  return (
    <section className="hero">
      <div className="heroContent">
        <p className="tag">PERSONAL DIGITAL GIFT FROM RUSHI</p>
        <h1>A little gift.<br /><span>Just for you, Dhriti ♡</span></h1>
        <p className="subtitle">Because one Rakhi (Sawant) wasn't enough.</p>
        <button className={`primary ${started ? 'isStarted' : ''}`} type="button" onClick={onStart}>
          {started ? "Lesssgooooooo ✨" : 'Lesssgooooooo ✨'}
        </button>
      </div>
    </section>
  );
}

export default Hero;
