import { useEffect, useRef, useState } from 'react';
import config from '../config/config';

function MusicPlayer() {
  const audioRef = useRef(null);
  const [songIndex, setSongIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const song = config.songs[songIndex];
  useEffect(() => { if (audioRef.current) { audioRef.current.src = song.file; if (playing) audioRef.current.play().catch(() => setPlaying(false)); } }, [song.file]);
  const togglePlay = () => { if (playing) audioRef.current.pause(); else audioRef.current.play().catch(() => setPlaying(false)); setPlaying(!playing); };
  const changeSong = (direction) => setSongIndex((index) => (index + direction + config.songs.length) % config.songs.length);
  return (
    <section id="music" className="section musicSection">
      <h2>♫ MUSIC</h2>
      <div className="musicPlayer" aria-label="Music player">
        <audio ref={audioRef} muted={muted} onEnded={() => changeSong(1)} />
        <span className="nowPlaying">NOW PLAYING <strong>{song.title}</strong></span>
        <div className="musicControls"><button type="button" onClick={() => changeSong(-1)} aria-label="Previous track">⏮</button><button type="button" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>{playing ? '❚❚' : '▶'}</button><button type="button" onClick={() => changeSong(1)} aria-label="Next track">⏭</button><button type="button" onClick={() => setMuted(!muted)} aria-label="Mute or unmute">{muted ? '🔇' : '🔊'}</button></div>
      </div>
    </section>
  );
}

export default MusicPlayer;
