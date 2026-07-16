/**
 * DISCOVER JAPAN - MUSIC CONSISTENCY SYSTEM
 * Preserves playback timestamp across page loads using localStorage.
 */
document.addEventListener("DOMContentLoaded", () => {
  const audio = document.querySelector(".floating-audio-player audio");
  if (!audio) return;

  // Restore saved playback time
  const savedTime = parseFloat(localStorage.getItem("jp_audio_time")) || 0;
  audio.currentTime = savedTime;

  // Periodically save playback position
  setInterval(() => {
    if (!audio.paused) {
      localStorage.setItem("jp_audio_time", audio.currentTime.toString());
    }
  }, 250);

  // Play automatically or queue to play on first user interaction (browser policy)
  audio.play().catch(() => {
    const forcePlay = () => {
      audio.play().catch(() => {});
      document.removeEventListener("click", forcePlay);
      document.removeEventListener("keydown", forcePlay);
    };
    document.addEventListener("click", forcePlay);
    document.addEventListener("keydown", forcePlay);
  });
});
