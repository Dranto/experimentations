const audio = document.getElementById("audio");
const player = document.querySelector(".bee-player");
const playPauseBtn = document.getElementById("playPauseBtn");
const playPauseIcon = document.getElementById("playPauseIcon");
const progressWrap = document.getElementById("progressWrap");
const progressFill = document.getElementById("progressFill");
const progressThumb = document.getElementById("progressThumb");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const volumeSlider = document.getElementById("volumeSlider");

let isDragging = false;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return "00:00";
  }

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function setProgress(percentage) {
  const value = Math.max(0, Math.min(100, percentage));
  progressFill.style.width = `${value}%`;
  progressThumb.style.left = `${value}%`;
}

function updateTimeline() {
  const { currentTime, duration } = audio;
  const percentage = duration ? (currentTime / duration) * 100 : 0;
  setProgress(percentage);
  currentTimeEl.textContent = formatTime(currentTime);
  durationEl.textContent = formatTime(duration);
}

function seekByClientX(clientX) {
  const rect = progressWrap.getBoundingClientRect();
  const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
  const ratio = rect.width ? x / rect.width : 0;
  audio.currentTime = ratio * (audio.duration || 0);
}

function togglePlayPause() {
  if (audio.paused) {
    audio.play();
    return;
  }

  audio.pause();
}

function animateButtonPress() {
  playPauseBtn.classList.remove("pressed");
  void playPauseBtn.offsetWidth;
  playPauseBtn.classList.add("pressed");
}

playPauseBtn.addEventListener("click", () => {
  animateButtonPress();
  togglePlayPause();
});

audio.addEventListener("play", () => {
  playPauseIcon.textContent = "⏸";
  player.classList.add("is-playing");
});

audio.addEventListener("pause", () => {
  playPauseIcon.textContent = "▶";
  player.classList.remove("is-playing");
});

audio.addEventListener("ended", () => {
  playPauseIcon.textContent = "▶";
  player.classList.remove("is-playing");
});

audio.addEventListener("loadedmetadata", updateTimeline);
audio.addEventListener("timeupdate", () => {
  if (!isDragging) {
    updateTimeline();
  }
});

progressWrap.addEventListener("click", (event) => {
  seekByClientX(event.clientX);
  updateTimeline();
});

progressWrap.addEventListener("pointerdown", (event) => {
  isDragging = true;
  seekByClientX(event.clientX);
  updateTimeline();
});

window.addEventListener("pointermove", (event) => {
  if (!isDragging) {
    return;
  }

  seekByClientX(event.clientX);
  updateTimeline();
});

window.addEventListener("pointerup", () => {
  isDragging = false;
});

volumeSlider.addEventListener("input", () => {
  audio.volume = Number(volumeSlider.value);
});

audio.volume = Number(volumeSlider.value);
updateTimeline();
