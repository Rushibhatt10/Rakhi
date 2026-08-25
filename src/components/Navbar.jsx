function Navbar() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="logo">RAKHI <span>'26</span></div>
      <div className="navLinks">
        <button type="button" onClick={() => scrollTo('photos')}>Us ♡</button>
        <button type="button" onClick={() => scrollTo('gift-cam')}>Gift Cam</button>
        <button type="button" onClick={() => scrollTo('music')}>Music</button>
        <button className="navButton" type="button" onClick={() => scrollTo('photos')}>Open Surprise →</button>
      </div>
    </nav>
  );
}

export default Navbar;
