const loadingScreen = document.getElementById('loading-screen');
const mainContent = document.getElementById('main-content');
const flowers = document.querySelectorAll('.flower');
const linksOut = document.querySelectorAll('.link-out');
const links = [];

// loading screen
window.addEventListener('load', () => {
	loadingScreen.style.display = 'none';
	mainContent.style.display = 'block';
})

// spinning flower decals
window.addEventListener('scroll', () => {
	const scroll = window.scrollY;
	const rotation = scroll % 360; 
	flowers.forEach(flower => {
		flower.style.transform = `rotate(${rotation}deg)`;
	});
});

// open game from portfolio
function openTama(event) {
	event.preventDefault(); 
	let indexTab = window.open('index.html', '_blank');
	indexTab.onload = () => {
		indexTab.document.getElementById('music').click();
		indexTab.document.getElementById('heart-btn').click(); 
	}
}
