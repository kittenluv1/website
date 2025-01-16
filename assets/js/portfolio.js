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

// link out hover change
linksOut.forEach(link => {
	link.addEventListener('mouseenter', () => {
		link.style.opacity = 0.7;  
	});
	link.addEventListener('mouseleave', () => {
		link.style.opacity = 1;
	});
})

// open game from portfolio
function openTama(event) {
	event.preventDefault(); 
	let indexTab = window.open('index.html', '_blank');
	indexTab.onload = () => {
		indexTab.document.getElementById('music').click();
		indexTab.document.getElementById('heart-btn').click(); 
	}
}
