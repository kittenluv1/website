import songs from "../../data/songs.json";
import { closeModal, isModalDragging, openModal } from "../modal/modal.ts";

const INDEX_MODAL_ID = "indexModal";

const modal = document.querySelector(`dialog[data-modal-id="${INDEX_MODAL_ID}"]`);
const indexModal = document.getElementById("index-modal");

if (!modal || !indexModal) {
  throw new Error("index modal elements not found");
}

modal.addEventListener("dblclick", (e) => {
  if (e.target.closest("button")) return;
  closeModal(INDEX_MODAL_ID);
});

// TAMA SHELLS
const screenDiv = document.getElementById("screen-div");
const shellImage = document.getElementById("tama-shell");

const shells = [
  {
    rows: "1.3fr 1.7fr .2fr 4.7fr 1.5fr 1.5fr 1fr",
    columns: "2.5fr .6fr .4fr .5fr 1fr .6fr .4fr .6fr 2.4fr",
  },
  {
    rows: "1.5fr 1.7fr .4fr 5fr .7fr 1.5fr 1.2fr",
    columns: "2.4fr .5fr .4fr .6fr .9fr .6fr .4fr .5fr 2.2fr",
  },
  {
    rows: "1.3fr 1.5fr .2fr 4.9fr .9fr 1.5fr 1.6fr",
    columns: "2.4fr .6fr .4fr .5fr 1fr .6fr .4fr .6fr 2.2fr",
  },
  {
    rows: ".3fr 2.9fr .2fr 4.8fr .8fr 1.5fr 1.4fr",
    columns: "2.3fr .6fr .4fr .5fr 1fr .6fr .4fr .6fr 2.3fr",
  },
];

function changeShell() {
  if (!shellImage) return;

  const currentShell = Number(shellImage.src.split("/").pop()?.split(".")[0]);
  const i = (currentShell + 1) % shells.length;
  shellImage.src = `/images/index/modal/shells/${i}.png`;
  shellImage.onload = () => {
    indexModal.style.gridTemplateRows = shells[i].rows;
    indexModal.style.gridTemplateColumns = shells[i].columns;
  };
}

indexModal.addEventListener("click", (event) => {
  if (isModalDragging(INDEX_MODAL_ID)) return;
  if (event.target.closest("#screen-div, button")) return;
  event.stopPropagation();
  changeShell();
});

screenDiv?.addEventListener("click", (event) => {
  event.stopPropagation();
  if (isModalDragging(INDEX_MODAL_ID)) return;
  if (event.target.closest("#music-image")) return;
  changeScreen();
});

// TAMA SCREENS
const instructions = document.getElementById("instructions");
const game = document.getElementById("tama-game");
const screenImage = document.getElementById("music-image");
const character = document.getElementById("mametchi");
const heartButton = document.getElementById("heart-btn");

let currentView = "instructions";
let isGamePlaying = false;

function isScreenVisible(el) {
  if (!el) return false;
  return getComputedStyle(el).display !== "none";
}

function initScreens() {
  if (instructions) instructions.style.display = "block";
  if (game) game.style.display = "none";
  currentView = "instructions";
}

initScreens();

heartButton?.addEventListener("click", (e) => {
  e.stopPropagation();
  changeScreen();
});

function detectView() {
  if (!isScreenVisible(instructions) && !isScreenVisible(game)) {
    return "images";
  }
  if (isScreenVisible(game)) return "game";
  return "instructions";
}

function changeScreen() {
  currentView = detectView();
  if (currentView === "instructions") {
    if (instructions) instructions.style.display = "none";
    if (game) game.style.display = "block";
  } else if (currentView === "game") {
    if (instructions) instructions.style.display = "none";
    if (game) game.style.display = "none";
    character?.classList.remove("jump");
  } else {
    if (instructions) instructions.style.display = "block";
    if (game) game.style.display = "none";
  }
  modal.focus();
}

let isKeyPress = false;

modal.addEventListener("keydown", (e) => {
  currentView = detectView();
  if (e.key === " ") e.preventDefault();
  if (e.key === " " && !isKeyPress) {
    isKeyPress = true;
    if (currentView === "game") {
      if (!isGamePlaying) {
        isGamePlaying = true;
        startGame();
      }
      tamaJUMP();
    }
  }
});

modal.addEventListener("keyup", () => {
  isKeyPress = false;
});

// IMAGES
let imageIndex = 0;
const images = [
  "/images/index/modal/beach.jpg",
  "/images/index/modal/bed.jpg",
  "/images/index/modal/blossoms.jpg",
  "/images/index/modal/computer.jpg",
  "/images/index/modal/emogirl.jpg",
  "/images/index/modal/friends.jpg",
  "/images/index/modal/gif.gif",
  "/images/index/modal/hellokitty.jpg",
  "/images/index/modal/nana.jpg",
  "/images/index/modal/night.jpg",
  "/images/index/modal/producer.jpg",
  "/images/index/modal/river.JPG",
  "/images/index/modal/toro%20and%20frog.jpg",
  "/images/index/modal/toro%20gets%20offended.jpg",
  "/images/index/modal/tsundere.jpg",
  "/images/index/modal/XPgirl.JPG",
];

if (screenImage) {
  screenImage.src = images[imageIndex];
  screenImage.addEventListener("click", () => {
    if (isModalDragging(INDEX_MODAL_ID)) return;
    screenImage.src = images[changeImage()];
  });
}

function changeImage() {
  imageIndex = (imageIndex + 1) % images.length;
  return imageIndex;
}

// AUDIO
let songIndex = 0;
const audio = document.getElementById("audio");
const prevButton = document.getElementById("previous");
const playButton = document.getElementById("play");
const nextButton = document.getElementById("next");

playButton?.addEventListener("click", playPause);
prevButton?.addEventListener("click", prevSong);
nextButton?.addEventListener("click", nextSong);
audio?.addEventListener("ended", nextSong);

loadSong();

function loadSong() {
  if (!audio) return;
  audio.src = songs[songIndex];
  audio.load();
}

function playPause() {
  if (!audio) return;
  if (audio.paused) audio.play();
  else audio.pause();
}

function prevSong() {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong();
  playPause();
}

function nextSong() {
  songIndex = (songIndex + 1) % songs.length;
  loadSong();
  playPause();
}

// button sound effects
const hover = new Audio("/audio/sound-fx/hover.mp3");
const click = new Audio("/audio/sound-fx/click.mp3");

const modalButtons = [heartButton, prevButton, playButton, nextButton].filter(
  Boolean,
);

modalButtons.forEach((button) => {
  button.addEventListener("mouseenter", () => {
    hover.play();
  });
  button.addEventListener("click", () => {
    click.play();
  });
  button.addEventListener("click", (event) => {
    event.stopPropagation();
  });
});

// TAMA GAME
const initialFrequency = 1200;
let numObstacles = 0;
let obstacleTimeoutID = 0;
let obstacleFrequency = initialFrequency;
let minFrequency = initialFrequency;
const score = document.getElementById("score");
const scoreDiv = document.getElementsByClassName("score-div")[0];
const gameOver = document.getElementsByClassName("game-over")[0];

function tamaJUMP() {
  if (!character) return;
  character.src = "/images/index/modal/jump.png";
  character.classList.remove("jump");
  void character.offsetWidth;
  character.classList.add("jump");
  character.addEventListener(
    "animationend",
    () => {
      character.src = "/images/index/modal/mametchi.png";
    },
    { once: true },
  );
}

function startGame() {
  if (!score || !gameOver || !scoreDiv || !character) return;

  numObstacles = 0;
  score.innerHTML = String(numObstacles);
  gameOver.style.display = "none";
  scoreDiv.appendChild(score);
  obstacleTimeoutID = 0;
  obstacleFrequency = initialFrequency;
  minFrequency = initialFrequency;
  character.style.animationPlayState = "running";
  document.querySelectorAll(".obstacle").forEach((obstacle) => {
    obstacle.remove();
  });
  obstacleTimeoutID = window.setTimeout(() => createObstacle(), initialFrequency);
}

function createObstacle() {
  if (!isGamePlaying || !character || !score) return;

  numObstacles++;
  const obstacle = document.createElement("span");
  obstacle.classList.add("obstacle");
  obstacle.innerHTML = "|";
  character.insertAdjacentElement("afterend", obstacle);

  const collisionIntervalID = window.setInterval(() => {
    detectCollision(obstacle, collisionIntervalID);
  }, 10);

  obstacle.addEventListener("animationend", () => {
    obstacle.remove();
    clearInterval(collisionIntervalID);
    score.innerHTML = String(numObstacles);
  });

  obstacleTimeoutID = window.setTimeout(
    () => createObstacle(),
    setNextFrequency(),
  );
}

function detectCollision(obstacle, ID) {
  if (!character) return;

  const characterRect = character.getBoundingClientRect();
  const obstacleRect = obstacle.getBoundingClientRect();
  const characterWidth = characterRect.width;
  const characterRight = characterRect.right - characterWidth * 0.35;
  const characterLeft = characterRect.left + characterWidth * 0.5;
  const obstacleTop = obstacleRect.top + obstacleRect.height * 0.5;

  if (
    characterRight >= obstacleRect.left &&
    characterLeft <= obstacleRect.right &&
    characterRect.bottom >= obstacleTop
  ) {
    clearInterval(ID);
    endGame();
  }
}

function endGame() {
  if (!character || !gameOver || !score) return;

  clearTimeout(obstacleTimeoutID);
  window.setTimeout(() => {
    isGamePlaying = false;
  }, 500);
  character.style.animationPlayState = "paused";
  document.querySelectorAll(".obstacle").forEach((obstacle) => {
    obstacle.style.animationPlayState = "paused";
  });
  gameOver.style.display = "block";
  gameOver.appendChild(score);
}

function setNextFrequency() {
  minFrequency = Math.max(500, initialFrequency - 100 * numObstacles);
  obstacleFrequency = Math.random() * obstacleFrequency + minFrequency;
  return obstacleFrequency;
}

window.addEventListener("load", () => {
  if (!window.location.hash.includes("tama")) return;

  initScreens();
  openModal(INDEX_MODAL_ID);
});
