
//modal interactivity
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

let isDragging = false; 
let offsetX, offsetY; 
modal.addEventListener('mousedown', function(e) {
	isDragging = true; 
	offsetX = e.clientX - modal.offsetLeft; 
	offsetY = e.clientY - modal.offsetTop; 
	document.body.style.cursor = 'grabbing';
})
document.addEventListener('mousemove', function(e) {
	if (isDragging) {
		let newLeft = e.clientX - offsetX; 
		let newTop = e.clientY - offsetY; 
		modal.style.left = `${newLeft}px`;
		modal.style.top = `${newTop}px`; 
	}
})
document.addEventListener('mouseup', () => {
	isDragging = false; 
	document.body.style.cursor = 'default';
})

// tama screens
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

// images
let imageIndex = 0;
fetch('assets/json/index/images.json')
	.then(response => response.json())
	.then(images => {
		screenImage.src = images[imageIndex]; 	//load first image
		screenImage.addEventListener('click', () => {
			screenImage.src = images[changeImage()];
		});
		function changeImage() {
			imageIndex = (imageIndex + 1) % images.length; 
			return imageIndex; 
		}
	})
 
// audio player functionality
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
fetch('assets/json/index/songs.json')
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
const hover = new Audio('assets/media/sound effects/hover.mp3');
const click = new Audio('assets/media/sound effects/click.mp3');

const modalButtons = [heartButton, prevButton, playButton, nextButton];
modalButtons.forEach(button => {
	button.addEventListener('mouseenter', () => {
		hover.play(); 
	})
	button.addEventListener('click', () => {
		click.play(); 
	})
})
