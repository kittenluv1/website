const flowers = document.querySelectorAll('.flower');
const linksOut = document.querySelectorAll('.link-out');
const links = []

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
	let indexTab = window.open('/index.html', '_blank');
	indexTab.onload = () => {
		indexTab.document.getElementById('music').click();
		indexTab.document.getElementById('heart-btn').click(); 
	}
}
