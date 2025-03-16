const initialFrequency = 1200; 
let numObstacles = 0; 
let obstacleTimeoutID = 0; 
let obstacleFrequency = initialFrequency; 
let minFrequency = initialFrequency; 
const score = document.getElementById('score'); 
const scoreDiv = document.getElementsByClassName('score-div')[0]; 
const gameOver = document.getElementsByClassName('game-over')[0]; 

// tama JUMP!
function tamaJUMP() {
	character.src = "/assets/index/jump/imgs/jump.png";
	character.classList.remove('jump'); 
	void character.offsetWidth; 
	character.classList.add('jump'); 
	character.addEventListener('animationend', () => {
		character.src = "/assets/index/jump/imgs/mametchi.png";
	}, { once: true });
}

function startGame() {
	//restart game values
	numObstacles = 0; 
	score.innerHTML = numObstacles; 
	gameOver.style.display = 'none'; 
	scoreDiv.appendChild(score); 
	obstacleTimeoutID = 0; 
	obstacleFrequency = initialFrequency; 
	minFrequency = initialFrequency; 
	character.style.animationPlayState = 'running';
	const obstacles = document.querySelectorAll('.obstacle');
	obstacles.forEach(obstacle => {
		obstacle.remove();
	});
	//start obstacle chain
	obstacleTimeoutID = setTimeout(() => createObstacle(), initialFrequency);
}

function createObstacle() {
	if (!isGamePlaying) return; 
	// create span
	numObstacles++; 
	const obstacle = document.createElement('span'); 
	obstacle.classList.add('obstacle'); 
	obstacle.innerHTML = '|'; 
	character.insertAdjacentElement('afterend', obstacle); 
	// detect collisions
	const collisionIntervalID = setInterval(() => {
        detectCollision(obstacle, collisionIntervalID);
    }, 10);
	// remove when done
	obstacle.addEventListener('animationend', () => {
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
	let characterRight = characterRect.right - (characterWidth * .35);
	let characterLeft = characterRect.left + (characterWidth * .5);
	let obstacleTop = obstacleRect.top + (obstacleRect.height * .5); 
	// detect collisions
	if (characterRight >= obstacleRect.left && characterLeft <= obstacleRect.right && characterRect.bottom >= obstacleTop) {
		clearInterval(ID); 
		endGame(); 
	}
}

function endGame() {
	clearTimeout(obstacleTimeoutID); 
	setTimeout(() => isGamePlaying = false, 500); 
	character.style.animationPlayState = 'paused';
	const obstacles = document.querySelectorAll('.obstacle');
	obstacles.forEach(obstacle => {
		obstacle.style.animationPlayState = 'paused';
	});
	gameOver.style.display = 'block'; 
	gameOver.appendChild(score); 
}

function setNextFrequency() {
	minFrequency = Math.max(500, initialFrequency - (100 * numObstacles));
	obstacleFrequency = Math.random() * obstacleFrequency + minFrequency; 
	return obstacleFrequency; 
}