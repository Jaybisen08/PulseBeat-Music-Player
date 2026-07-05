const songs = [
  {
    title: "Blue",
    artist: "Yung Kai",
    src: "songs/blue.mp3",
    cover: "images/blue.jpg"
  },
  {
    title: "Until I Found You",
    artist: "Stephen Sanchez",
    src: "songs/untilifoundyou.mp3",
    cover: "images/untilifoundyou.jpg"
  },
  {
    title: "Hymn for the Weekend",
    artist: "Coldplay ft. Beyoncé",
    src: "songs/hymnfortheweekend.mp3",
    cover: "images/hymnfortheweekend.jpg"
  },
  {
    title: "Perfect",
    artist: "Ed Sheeran",
    src: "songs/perfect.mp3",
    cover: "images/perfect.jpg"
  },
  {
    title: "Sawar Loon",
    artist: "Monali Thakur",
    src: "songs/sawarloon.mp3",
    cover: "images/sawarloon.jpg"
  }, 

  {
    title: "Arz Kiya Hai",
    artist: "Anuv jain",
    src: "songs/Arz kiya hai.mp3",
    cover: "images/arz.jpg"
  }
];

let currentSong = localStorage.getItem("lastSong")
  ? parseInt(localStorage.getItem("lastSong"))
  : 0;

let isPlaying = false;

const audio = new Audio();

const playBtn = document.querySelector(".play-btn");
const progressBar = document.getElementById("progressBar");
const volumeSlider = document.getElementById("volumeSlider");
const songTitle = document.getElementById("songTitle");
const artistName = document.getElementById("artistName");
const mainCover = document.getElementById("mainCover");
const themeToggle = document.getElementById("themeToggle");

const playlistSongs = document.querySelectorAll(".playlist-song");
const nextBtns = document.querySelectorAll(".fa-forward");
const prevBtns = document.querySelectorAll(".fa-backward");

const heroPlayBtn = document.querySelector(".primary-btn");
const exploreBtn = document.querySelector(".secondary-btn");
const featuredBtns = document.querySelectorAll(".track-card button");

const miniPlayerTitle = document.querySelector(".mini-song h4");
const miniPlayerImg = document.querySelector(".mini-song img");
const miniPlayBtns = document.querySelectorAll(".mini-controls button");

const currentTimeEl = document.querySelector(".progress-container span:first-child");
const totalTimeEl = document.querySelector(".progress-container span:last-child");

/* Load Song */
function loadSong(index) {
  audio.src = songs[index].src;

  songTitle.innerText = songs[index].title;
  artistName.innerText = songs[index].artist;
  mainCover.src = songs[index].cover;

  miniPlayerTitle.innerText = songs[index].title;
  miniPlayerImg.src = songs[index].cover;

  localStorage.setItem("lastSong", index);

  updateActiveSong();
}

/* Play */
function playSong() {
  audio.play();
  isPlaying = true;

  playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
  miniPlayBtns[1].innerHTML = `<i class="fa-solid fa-pause"></i>`;

  mainCover.style.animationPlayState = "running";
}

/* Pause */
function pauseSong() {
  audio.pause();
  isPlaying = false;

  playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
  miniPlayBtns[1].innerHTML = `<i class="fa-solid fa-play"></i>`;

  mainCover.style.animationPlayState = "paused";
}

/* Toggle Play */
function togglePlay() {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
}

playBtn.addEventListener("click", togglePlay);
miniPlayBtns[1].addEventListener("click", togglePlay);

/* Next Song */
function nextSong() {
  currentSong++;

  if (currentSong >= songs.length) {
    currentSong = 0;
  }

  loadSong(currentSong);
  playSong();
}

/* Previous Song */
function prevSong() {
  currentSong--;

  if (currentSong < 0) {
    currentSong = songs.length - 1;
  }

  loadSong(currentSong);
  playSong();
}

/* Next Buttons */
nextBtns.forEach(btn => {
  btn.parentElement.addEventListener("click", nextSong);
});

/* Previous Buttons */
prevBtns.forEach(btn => {
  btn.parentElement.addEventListener("click", prevSong);
});

miniPlayBtns[0].addEventListener("click", prevSong);
miniPlayBtns[2].addEventListener("click", nextSong);

/* Hero Button */
heroPlayBtn.addEventListener("click", () => {
  playSong();
});

/* Explore Button */
exploreBtn.addEventListener("click", () => {
  document.querySelector(".playlist").scrollIntoView({
    behavior: "smooth"
  });
});

/* Featured Tracks */
featuredBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    currentSong = index;
    loadSong(currentSong);
    playSong();
  });
});

/* Playlist Songs */
playlistSongs.forEach((song, index) => {
  song.addEventListener("click", () => {
    currentSong = index;
    loadSong(currentSong);
    playSong();
  });
});

/* Active Song Highlight */
function updateActiveSong() {
  playlistSongs.forEach(song =>
    song.classList.remove("active")
  );

  if (playlistSongs[currentSong]) {
    playlistSongs[currentSong].classList.add("active");
  }
}

/* Progress Update */
audio.addEventListener("timeupdate", () => {
  const progress =
    (audio.currentTime / audio.duration) * 100;

  progressBar.value = progress || 0;

  currentTimeEl.innerText = formatTime(audio.currentTime);
});

/* Total Duration */
audio.addEventListener("loadedmetadata", () => {
  totalTimeEl.innerText = formatTime(audio.duration);
});

/* Seek */
progressBar.addEventListener("input", () => {
  audio.currentTime =
    (progressBar.value / 100) * audio.duration;
});

/* Format Time */
function formatTime(time) {
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);

  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

/* Volume */
const savedVolume = localStorage.getItem("volume");

if (savedVolume) {
  audio.volume = savedVolume;
  volumeSlider.value = savedVolume * 100;
}

volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value / 100;
  localStorage.setItem("volume", audio.volume);
});

/* Autoplay */
audio.addEventListener("ended", nextSong);

/* Theme */
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light-mode");
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");

  const icon = themeToggle.querySelector("i");

  if (document.body.classList.contains("light-mode")) {
    icon.classList.replace("fa-moon", "fa-sun");
    localStorage.setItem("theme", "light");
  } else {
    icon.classList.replace("fa-sun", "fa-moon");
    localStorage.setItem("theme", "dark");
  }
});

/* Initial Setup */
loadSong(currentSong);
mainCover.style.animationPlayState = "paused";

/* GSAP Animations */
gsap.from(".navbar", {
  y: -100,
  opacity: 0,
  duration: 1
});

gsap.from(".hero-content h1", {
  x: -100,
  opacity: 0,
  duration: 1
});

gsap.from(".hero-content p", {
  x: -100,
  opacity: 0,
  duration: 1.3
});

gsap.from(".hero-buttons", {
  y: 50,
  opacity: 0,
  duration: 1.5
});

gsap.from(".hero-image", {
  scale: 0.5,
  opacity: 0,
  duration: 1.5
});