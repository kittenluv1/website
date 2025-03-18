
// MODAL INTERACTIVITY
const modal = document.getElementsByClassName('modal')[0]; 
document.getElementById('music').addEventListener('dblclick', toggleDisplay);
modal.addEventListener('dblclick', toggleDisplay); 
function toggleDisplay() {
	if (modal.style.display === 'grid')
		modal.style.display = 'none'; 
	else {
		modal.style.display = 'grid'; 
		modal.focus();
	}
}

let dragStart = false; 
let isDragging = false;
let offsetX, offsetY;
let dragThreshold = 5;
let startX, startY;

modal.addEventListener('mousedown', function(e) {
	dragStart = true;
    startX = e.clientX; 
    startY = e.clientY;
    offsetX = e.clientX - modal.offsetLeft;
    offsetY = e.clientY - modal.offsetTop;
    document.body.style.cursor = 'grabbing';
});

modal.addEventListener('mousemove', function(e) {
    if (dragStart) {
        // Check if the mouse moved enough to consider it a drag
        let distX = Math.abs(e.clientX - startX);
        let distY = Math.abs(e.clientY - startY);
        if (distX > dragThreshold || distY > dragThreshold) {
            isDragging = true;  // If movement exceeds threshold, start dragging
        }
    }

    if (isDragging) {
        let newLeft = e.clientX - offsetX;
        let newTop = e.clientY - offsetY;
        modal.style.left = `${newLeft}px`;
        modal.style.top = `${newTop}px`;
    }
});

modal.addEventListener('mouseup', (e) => {
	dragStart = false; 
    setTimeout(() => {
        isDragging = false;
        document.body.style.cursor = 'default';
    }, 0); // Delay the reset by a small amount
});

// tama shells
const screenDiv = document.getElementById('screen-div');
shellImage = document.getElementById('tama-shell'); 
screenDiv.addEventListener('click', (event) => { event.stopPropagation(); });
modal.addEventListener('click', (e) => {
	if (isDragging) return;
	// change shell images
	let src = shellImage.src.split('/').pop();
	if (src === "2.png") {
		shellImage.src = "/index/music/imgs/shells/3.png";
		shellImage.onload = () => {
			modal.style.gridTemplateRows = "1.3fr 1.5fr .2fr 4.9fr .9fr 1.5fr 1.6fr";
			modal.style.gridTempateColumns = "2.4fr .6fr .4fr .5fr 1fr .6fr .4fr .6fr 2.2fr";
		}
	}
	else if (src === "3.png") {
		shellImage.src = "/index/music/imgs/shells/4.png";
		shellImage.onload = () => {
			modal.style.gridTemplateRows = ".3fr 2.9fr .2fr 4.8fr .8fr 1.5fr 1.4fr";
			modal.style.gridTemplateColumns = "2.3fr .6fr .4fr .5fr 1fr .6fr .4fr .6fr 2.3fr";
		}
	}
	else if (src === "4.png") {
		shellImage.src = "/index/music/imgs/shells/1.png"
		shellImage.onload = () => {
			modal.style.gridTemplateRows = "1.3fr 1.7fr .2fr 4.7fr 1.5fr 1.5fr 1fr"; 
			modal.style.gridTemplateColumns = "2.5fr .6fr .4fr .5fr 1fr .6fr .4fr .6fr 2.4fr"; 
		}
	}
	else {
		shellImage.src = "/index/music/imgs/shells/2.png";
		shellImage.onload = () => {
			modal.style.gridTemplateRows = "1.5fr 1.7fr .4fr 5fr .7fr 1.5fr 1.2fr"; 
			modal.style.gridTemplateColumns = "2.4fr .5fr .4fr .6fr .9fr .6fr .4fr .5fr 2.2fr"; 
		}
	}
})

// TAMA SCREENS
const instructions = document.getElementById('instructions'); 
const game = document.getElementById('tama-game');
let screenImage = document.getElementById('music-image');
let currentView = 'instructions'; 
const character = document.getElementById('mametchi');
let isGamePlaying = false; 

//heart buttons toggles between screens
const heartButton = document.getElementById('heart-btn')
heartButton.addEventListener('click', changeScreen);
function detectView() {
	if (instructions.style.display === 'none' && game.style.display === 'none')
		return 'images'; 
    else if (game.style.display === 'block')
		return 'game'; 
	else /* at the beginning, (instructions.style.display === 'block') */ {
        return 'instructions'; 
	}
}
function changeScreen() {
	currentView = detectView(); 
	if (currentView === 'instructions') {
		instructions.style.display = 'none';
        game.style.display = 'block';
	}
	else if (currentView === 'game') {
        instructions.style.display = 'none';
        game.style.display = 'none';
		//stop game on exit
		character.classList.remove('jump'); 
		//end the game
	}
	else if (currentView = 'images') {
        instructions.style.display = 'block';
        game.style.display = 'none';
	}
	modal.focus(); 
}

// pressing space does functionalities within screens
let isKeyPress = false; 
modal.addEventListener('keydown', (e) => {
	currentView = detectView(); 
	if (e.key === ' ') {
		e.preventDefault(); 
	}
	if (e.key === ' ' && !isKeyPress) {
		isKeyPress = true; 
		if (currentView === 'game') {
			if (!isGamePlaying) {
				isGamePlaying = true; 
				startGame(); 
			}
			tamaJUMP(); 
		} 
	}
})
modal.addEventListener('keyup', (e) => {
	isKeyPress = false; 
})

// IMAGES
let imageIndex = 0;
fetch('/index/music/images.json')
	.then(response => response.json())
	.then(images => {
		screenImage.src = images[imageIndex]; 	//load first image
		screenImage.addEventListener('click', () => {
			if (isDragging) return;
			screenImage.src = images[changeImage()];
		});
		function changeImage() {
			imageIndex = (imageIndex + 1) % images.length; 
			return imageIndex; 
		}
	})
 
// AUDIO
let songIndex = 0;
const songs = [];
const audio = document.getElementById('audio');
const prevButton = document.getElementById('previous');
const playButton = document.getElementById('play');
const nextButton = document.getElementById('next');

playButton.addEventListener('click', playPause);
prevButton.addEventListener('click', prevSong); 
nextButton.addEventListener('click', nextSong);
audio.addEventListener('ended', nextSong);

// load in songs
fetch('/index/music/songs.json')
.then(response => response.json())
.then(data => {
	data.forEach(song => {
		songs.push(song);
	})
	loadSong();
});

function loadSong() {
	audio.src = songs[songIndex];
	audio.load();
}
function playPause() {
	if (audio.paused)
		audio.play();
	else
		audio.pause(); 
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
const hover = new Audio('/global/audio/sound-fx/hover.mp3');
const click = new Audio('/global/audio/sound-fx/click.mp3');

const modalButtons = [heartButton, prevButton, playButton, nextButton];
modalButtons.forEach(button => {
	button.addEventListener('mouseenter', () => {
		hover.play(); 
	});
	button.addEventListener('click', () => {
		click.play(); 
	});
	button.addEventListener('click', (event) => {
		event.stopPropagation(); 
	});
})
