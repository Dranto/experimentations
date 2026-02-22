const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("playPauseBtn");
const playPauseIcon = document.getElementById("playPauseIcon");
const rewindBtn = document.getElementById("rewindBtn");
const forwardBtn = document.getElementById("forwardBtn");
const progressWrap = document.getElementById("progressWrap");
const progressFill = document.getElementById("progressFill");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const volumeSlider = document.getElementById("volumeSlider");
const speedSelect = document.getElementById("speedSelect");

let isDragging = false;

function formatTime(sec) {
  if (!Number.isFinite(sec)) {
    return "00:00";
  }

  const min = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);

  return `${String(min).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function updateProgress() {
  const { currentTime, duration } = audio;
  const percent = duration ? (currentTime / duration) * 100 : 0;
  progressFill.style.width = `${percent}%`;
  currentTimeEl.textContent = formatTime(currentTime);
  durationEl.textContent = formatTime(duration);
}

function seekByClientX(clientX) {
  const rect = progressWrap.getBoundingClientRect();
  const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
  const ratio = x / rect.width;
  audio.currentTime = ratio * audio.duration;
}

function togglePlay() {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

playPauseBtn.addEventListener("click", togglePlay);

audio.addEventListener("play", () => {
  playPauseIcon.textContent = "⏸";
  playPauseBtn.classList.add("playing");
});

audio.addEventListener("pause", () => {
  playPauseIcon.textContent = "▶";
  playPauseBtn.classList.remove("playing");
});

audio.addEventListener("timeupdate", () => {
  if (!isDragging) {
    updateProgress();
  }
});

audio.addEventListener("loadedmetadata", updateProgress);

audio.addEventListener("ended", () => {
  playPauseIcon.textContent = "▶";
  playPauseBtn.classList.remove("playing");
});

rewindBtn.addEventListener("click", () => {
  audio.currentTime = Math.max(0, audio.currentTime - 10);
});

forwardBtn.addEventListener("click", () => {
  const maxDuration = audio.duration || 0;
  audio.currentTime = Math.min(maxDuration, audio.currentTime + 10);
});

progressWrap.addEventListener("click", (event) => {
  seekByClientX(event.clientX);
});

progressWrap.addEventListener("pointerdown", (event) => {
  isDragging = true;
  seekByClientX(event.clientX);
});

window.addEventListener("pointermove", (event) => {
  if (!isDragging) {
    return;
  }

  seekByClientX(event.clientX);
});

window.addEventListener("pointerup", () => {
  isDragging = false;
});

volumeSlider.addEventListener("input", () => {
  audio.volume = Number(volumeSlider.value);
});

speedSelect.addEventListener("change", () => {
  audio.playbackRate = Number(speedSelect.value);
});

audio.volume = Number(volumeSlider.value);
audio.playbackRate = Number(speedSelect.value);
