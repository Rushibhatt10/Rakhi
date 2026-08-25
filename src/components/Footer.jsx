function Footer({ onReplay }) {
  return (
    <section className="section final">
      <h2>Happy Raksha Bandhan ♡</h2>
      <p>Just wanted to make something a little special for you this year.</p>
      <p>Hope your day is full of good vibes, chocolates, and lots of reasons to smile.</p>
      <p>Stay exactly the way you are. ♡</p>
      <button className="textButton replayButton" type="button" onClick={onReplay}>REPLAY EXPERIENCE ↗</button>
    </section>
  );
}

export default Footer;
