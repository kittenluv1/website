const loadingScreen = document.getElementById('loading-screen');
const mainContent = document.getElementById('main-content');
const flowers = document.querySelectorAll('.flower');
const linksOut = document.querySelectorAll('.link-out');

// loading screen
window.addEventListener('load', () => {
	mainContent.style.display = 'block';
	setTimeout(() => {
		loadingScreen.style.display = 'none';
	}, 50);
})

// spinning flower decals
window.addEventListener('scroll', () => {
	const scroll = window.scrollY;
	const rotation = scroll % 360; 
	flowers.forEach(flower => {
		flower.style.transform = `rotate(${rotation}deg)`;
	});
});