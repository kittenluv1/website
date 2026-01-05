import songs from "../../data/songs.json";

// MODAL INTERACTIVITY
const modal = document.querySelector(".modal");
modal.addEventListener("dblclick", toggleDisplay);
document
  .getElementById("music")
  .addEventListener("dblclick", () => toggleDisplay());

function toggleDisplay() {
  if (modal.style.display === "grid") modal.style.display = "none";
  else {
    modal.style.display = "grid";
    modal.focus();
  }
}

let dragStart = false;
let isDragging = false;
let offsetX, offsetY;
let dragThreshold = 5;
let startX, startY;

modal.addEventListener("mousedown", function (e) {
  dragStart = true;
  startX = e.clientX;
  startY = e.clientY;
  offsetX = e.clientX - modal.offsetLeft;
  offsetY = e.clientY - modal.offsetTop;
  document.body.style.cursor = "grabbing";
});

document.addEventListener("mousemove", function (e) {
  if (dragStart) {
    // Check if the mouse moved enough to consider it a drag
    let distX = Math.abs(e.clientX - startX);
    let distY = Math.abs(e.clientY - startY);
    if (distX > dragThreshold || distY > dragThreshold) {
      isDragging = true; // If movement exceeds threshold, start dragging
    }
  }

  if (isDragging) {
    let newLeft = e.clientX - offsetX;
    let newTop = e.clientY - offsetY;
    modal.style.left = `${newLeft}px`;
    modal.style.top = `${newTop}px`;
  }
});

modal.addEventListener("mouseup", () => {
  dragStart = false;
  // slight delay to ensure click event doesn't fire immediately after drag
  setTimeout(() => {
    isDragging = false;
    document.body.style.cursor = "default";
  }, 0);
});

// TAMA SHELLS
const screenDiv = document.getElementById("screen-div");
const shellImage = document.getElementById("tama-shell");
screenDiv.addEventListener("click", (event) => {
  event.stopPropagation();
});
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
document.addEventListener("keydown", (e) => {
  if (e.key === "s" || e.key === "t") {
    let currentShell = Number(shellImage.src.split("/").pop().split(".")[0]); // shell source names map directly to index in shells array
    let i = (currentShell + 1) % shells.length;
    shellImage.src = `/images/index/modal/shells/${i}.png`;
    shellImage.onload = () => {
      modal.style.gridTemplateRows = shells[i].rows;
      modal.style.gridTemplateColumns = shells[i].columns;
    };
  }
});

window.addEventListener("load", () => {
  const hasTamaHash = window.location.hash.includes("tama");
  if (hasTamaHash) {
    modal.style.display = "grid";
    // reset current view in case it's different
    currentView = "instructions";
    changeScreen();
  }
});

// TAMA SCREENS
const instructions = document.getElementById("instructions");
const game = document.getElementById("tama-game");
let screenImage = document.getElementById("music-image");
let currentView = "instructions";
const character = document.getElementById("mametchi");
let isGamePlaying = false;

//heart buttons toggles between screens
const heartButton = document.getElementById("heart-btn");
heartButton.addEventListener("click", changeScreen);
function detectView() {
  if (instructions.style.display === "none" && game.style.display === "none")
    return "images";
  else if (game.style.display === "block") return "game";
  /* at the beginning, (instructions.style.display === 'block') */ else {
    return "instructions";
  }
}
function changeScreen() {
  currentView = detectView();
  if (currentView === "instructions") {
    instructions.style.display = "none";
    game.style.display = "block";
  } else if (currentView === "game") {
    instructions.style.display = "none";
    game.style.display = "none";
    //stop game on exit
    character.classList.remove("jump");
    //end the game
  } else if ((currentView = "images")) {
    instructions.style.display = "block";
    game.style.display = "none";
  }
  modal.focus();
}

// pressing space does functionalities within screens
let isKeyPress = false;
modal.addEventListener("keydown", (e) => {
  currentView = detectView();
  if (e.key === " ") {
    e.preventDefault();
  }
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
modal.addEventListener("keyup", (e) => {
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
screenImage.src = images[imageIndex]; //load first image
screenImage.addEventListener("click", () => {
  if (isDragging) return;
  screenImage.src = images[changeImage()];
});
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

playButton.addEventListener("click", playPause);
prevButton.addEventListener("click", prevSong);
nextButton.addEventListener("click", nextSong);
audio.addEventListener("ended", nextSong);

loadSong();

function loadSong() {
  audio.src = songs[songIndex];
  audio.load();
}
function playPause() {
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

const modalButtons = [heartButton, prevButton, playButton, nextButton];
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

// tama JUMP!
function tamaJUMP() {
  character.src = "/images/index/modal/jump.png";
  character.classList.remove("jump");
  void character.offsetWidth;
  character.classList.add("jump");
  character.addEventListener(
    "animationend",
    () => {
      character.src = "/images/index/modal/mametchi.png";
    },
    { once: true }
  );
}

function startGame() {
  //restart game values
  numObstacles = 0;
  score.innerHTML = numObstacles;
  gameOver.style.display = "none";
  scoreDiv.appendChild(score);
  obstacleTimeoutID = 0;
  obstacleFrequency = initialFrequency;
  minFrequency = initialFrequency;
  character.style.animationPlayState = "running";
  const obstacles = document.querySelectorAll(".obstacle");
  obstacles.forEach((obstacle) => {
    obstacle.remove();
  });
  //start obstacle chain
  obstacleTimeoutID = setTimeout(() => createObstacle(), initialFrequency);
}

function createObstacle() {
  if (!isGamePlaying) return;
  // create span
  numObstacles++;
  const obstacle = document.createElement("span");
  obstacle.classList.add("obstacle");
  obstacle.innerHTML = "|";
  character.insertAdjacentElement("afterend", obstacle);
  // detect collisions
  const collisionIntervalID = setInterval(() => {
    detectCollision(obstacle, collisionIntervalID);
  }, 10);
  // remove when done
  obstacle.addEventListener("animationend", () => {
    obstacle.remove();
    clearInterval(collisionIntervalID);
    score.innerHTML = numObstacles;
  });
  // schedule next obstacle
  obstacleTimeoutID = setTimeout(() => createObstacle(), setNextFrequency());
}

function detectCollision(obstacle, ID) {
  const characterRect = character.getBoundingClientRect();
  const obstacleRect = obstacle.getBoundingClientRect();
  // adjust for mametchi size & span size
  let characterWidth = characterRect.width;
  let characterRight = characterRect.right - characterWidth * 0.35;
  let characterLeft = characterRect.left + characterWidth * 0.5;
  let obstacleTop = obstacleRect.top + obstacleRect.height * 0.5;
  // detect collisions
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
  clearTimeout(obstacleTimeoutID);
  setTimeout(() => (isGamePlaying = false), 500);
  character.style.animationPlayState = "paused";
  const obstacles = document.querySelectorAll(".obstacle");
  obstacles.forEach((obstacle) => {
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
