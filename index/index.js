document.getElementById('blog').addEventListener('dblclick', () => window.location.href = 'blog');
document.getElementById('creations').addEventListener('dblclick', () => window.location.href = 'creations');
document.getElementById('japan').addEventListener('dblclick', () => window.open('https://youtu.be/3UTBZtwQMpI?si=sRSIXSru4suTvE5h'));
document.getElementById('portfolio').addEventListener('dblclick', () => window.open('portfolio'));
document.getElementById('flappy').addEventListener('dblclick', () => window.open('https://introspec.itch.io/flappypatchi'));
document.getElementById('neocities').addEventListener('dblclick', () => window.open('https://kittenluv1.neocities.org/'));
document.getElementById('resources').addEventListener('dblclick', () => window.open('https://kittenluv1.neocities.org/resources'));
document.getElementById('writing').addEventListener('dblclick', () => window.location.href = 'writing');
document.getElementById('detective').addEventListener('dblclick', () => window.open('https://introspec.itch.io/dimensional-detective'));
document.getElementById('pic').addEventListener('dblclick', () => window.open('https://kittenluv1.lovestoblog.com/'));
document.getElementById('gallery').addEventListener('dblclick', () => window.location.href = 'gallery');
document.getElementById('microblog').addEventListener('dblclick', () => window.location.href = 'blogbites');

const footer = document.querySelector('footer');
const pinkGradient = `linear-gradient(
		rgb(255, 225, 235) 0px,
		rgb(255, 215, 225) 3%,
		rgb(255, 210, 220) 6%,
		rgb(255, 205, 215) 10%,
		rgb(255, 210, 220) 12%,
		rgb(255, 220, 230) 15%,
		rgb(255, 225, 235) 18%,
		rgb(255, 230, 240) 20%,
		rgb(255, 235, 245) 23%,
		rgb(255, 240, 245) 38%,
		rgb(255, 235, 240) 54%,
		rgb(255, 230, 235) 86%,
		rgb(255, 235, 240) 89%,
		rgb(255, 240, 245) 92%,
		rgb(255, 245, 250) 95%,
		rgb(255, 250, 255) 98%
	  )`
const blueGradient = `linear-gradient(rgb(31, 47, 134) 0px, rgb(49, 101, 196) 3%, rgb(54, 130, 229) 6%, rgb(68, 144, 230) 10%, rgb(56, 131, 229) 12%, rgb(43, 113, 224) 15%, rgb(38, 99, 218) 18%, rgb(35, 91, 214) 20%, rgb(34, 88, 213) 23%, rgb(33, 87, 214) 38%, rgb(36, 93, 219) 54%, rgb(37, 98, 223) 86%, rgb(36, 95, 220) 89%, rgb(33, 88, 212) 92%, rgb(29, 78, 192) 95%, rgb(25, 65, 165) 98%)`
const lightBlueGradient = `linear-gradient(rgb(150, 180, 255) 0px,rgb(170, 200, 255) 3%,rgb(180, 210, 255) 6%, rgb(190, 220, 255) 10%, rgb(185, 215, 255) 12%, rgb(175, 205, 255) 15%, rgb(165, 195, 255) 18%, rgb(160, 190, 255) 20%, rgb(158, 188, 255) 23%, rgb(157, 187, 255) 38%, rgb(160, 192, 255) 54%, rgb(162, 195, 255) 86%, rgb(160, 193, 255) 89%, rgb(157, 187, 255) 92%, rgb(150, 180, 240) 95%, rgb(140, 170, 220) 98%)`
let currentColor = 'blue'; 
footer.addEventListener('click', () => {
	if (currentColor === 'pink') {
		footer.style.background = blueGradient;
		currentColor = 'blue'; 
	}
	else if (currentColor === 'blue') {
		footer.style.background = lightBlueGradient;
		currentColor = 'lightblue';
	}
	else {
		footer.style.background = pinkGradient;
		currentColor = 'pink';
	}
});