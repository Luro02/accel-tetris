var isPlaying = false;
var audio = new Audio(
  "gregorquendel-tetris-theme-korobeiniki-arranged-for-piano-186249.mp3",
);

function toggleAudio() {
  if (isPlaying) {
    audio.pause();
  } else {
    audio.play();
  }
  isPlaying = !isPlaying;
}

audio.addEventListener(
  "ended",
  function () {
    this.currentTime = 0;
    toggleAudio();
  },
  false,
);

document.getElementById("toggle-audio").addEventListener("click", () => {
  toggleAudio();
});
