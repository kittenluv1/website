const grid = document.getElementById('grid-container');
const nav = document.querySelector('nav'); 
const display = document.querySelector('.display'); 
const displayX = document.getElementById('close-display'); 
const emptyNav = document.getElementById('sticky-nav'); 
const dropdown = document.getElementById('dropdown-div');
const dropdownArrow = document.querySelector('.symbol'); 
const caption = document.getElementById('caption');
const backImage = document.getElementById('back');
const nextImage = document.getElementById('next');
const aboutBtn = document.getElementById('about-button');
const aboutDiv = document.getElementById('about-div');

// start sequence - load in all categories from json
let categories;
fetch(`/assets/creations/creations.json`)
	.then(response => response.json())
	.then(data => {
		// fill in categories array using json keys
		categories = Object.keys(data);
		// add categories to menu dropdown
		categories.forEach(category => {
			let item = document.createElement('button');
			item.innerHTML = category;
			item.addEventListener('click', () => {
				closeDisplay();
				displayWorks(category);
			});
			dropdown.appendChild(item); 
		});
		// add categories to main page
		categoriesBtn(); 
	});

// add event listeners for menu buttons
document.getElementById('index').addEventListener('click', () => window.location.href = '/');
document.getElementById('categories').addEventListener('click', categoriesBtn); 
displayX.addEventListener('click', closeDisplay);
document.getElementById('categories').addEventListener('mouseover', () => {
	dropdown.style.maxHeight = dropdown.scrollHeight + 'px'; 
});
document.getElementById('categories-div').addEventListener('mouseleave', () => {
	dropdown.style.maxHeight = 0; 
});
document.getElementById('all').addEventListener('click', allPiecesBtn);
aboutBtn.addEventListener('click', () => {
	if (aboutDiv.style.display === 'flex') {
		aboutDiv.style.display = 'none';
		aboutBtn.innerHTML = 'about';
	}
	else {
		aboutDiv.style.display = 'flex';
		aboutBtn.innerHTML += '<small>*</small>'
	}
});

function categoriesBtn() {
	removeElements(); 
	closeDisplay(); 
	displayCategories();
	addBreadcrumb("categories", categoriesBtn, "base");
}

// fetch all pieces and merge into combined array
let combinedArray = [];
fetch(`/assets/creations/creations.json`)
	.then(response => response.json())
	.then(data => {
		for (let key in data) {
			combinedArray = combinedArray.concat(data[key]); 
		}
	});
function allPiecesBtn() {
	removeElements(); 
	closeDisplay();
	addBreadcrumb("all pieces", allPiecesBtn, "base");
	combinedArray.forEach(work => {
		let image = createImage(work.images[0]);
		let button = createButton(image, work.title);
		button.addEventListener('click', () => {
			displayDetails(work, combinedArray, combinedArray.indexOf(work));
		});
	});
}

function displayCategories() {
	fetch(`/assets/creations/creations.json`)
	.then(response => response.json())
	.then(data => {
		categories.forEach(category => {
			let image = createImage(data[category][0].images[0]);
			let button = createButton(image, category);
			button.addEventListener('click', () => {
				displayWorks(category); 
			});
		})
	})
}

const backDisplay = document.getElementById('back-display');
const nextDisplay = document.getElementById('next-display');
function displayWorks(category) {
	removeElements(); 
	addBreadcrumb(category, () => displayWorks(category), "category");
	fetch(`/assets/creations/creations.json`)
	.then(response => response.json())
	.then(data => {
		let worksArray = data[category];
		for (let i = 0; i < worksArray.length; i++) {
			let currentWork = worksArray[i];
			let image = createImage(currentWork.images[0]);
			let button = createButton(image, currentWork.title);
			button.addEventListener('click', () => {
				displayDetails(currentWork, worksArray, i);
			}); 
		}
	})
}

const imageDiv = document.getElementById('images-div');
const displayImage = document.getElementById('image');
const title = document.getElementById('title'); 
const date = document.getElementById('date');
const description = document.getElementById('description');
const comment = document.getElementById('comments');
const imageBtns = document.getElementsByClassName('image-btn');
let isLoading = false; 
function displayDetails(work, category, index) {
	addBreadcrumb(work.title, () => displayDetails(work), "work");
	// display images & captions
	let i = 0; 
	let numImages = work.images.length;
	if (work.captions) {
		caption.innerHTML = work.captions[i];
		caption.style.display = 'block';
	} 
	displayImage.src = work.images[0]; 
	if (numImages > 1) {
		backImage.style.display = 'block'; 
		nextImage.style.display = 'block'; 
		backImage.onclick = () => {
			if (!isLoading) {
				i = (i - 1 + numImages) % numImages; 
				changeImage(work, i); 
			}
		}
		nextImage.onclick = () => {
			if (!isLoading) {
				i = (i + 1) % numImages; 
				changeImage(work, i); 
			}
		}
	}
	// add rest of elements for current work
	title.innerHTML = work.title;
	date.innerHTML = `date: ${work.date}`;
	description.innerHTML = `description: ${work.description}`;
	comment.innerHTML = `comments: ${work.comments}`;
	display.style.display = 'grid'; 
	grid.style.opacity = 0.6; 
	// add functionality to back and next buttons
	backDisplay.onclick = () => {
		hideDisplayButtons();
		let prevIndex = (index - 1 + category.length) % category.length;
		displayDetails(category[prevIndex], category, prevIndex);
	};
	nextDisplay.onclick = () => {
		hideDisplayButtons();
		let nextIndex = (index + 1) % category.length;
		displayDetails(category[nextIndex], category, nextIndex);
	};
}

function changeImage(work, i) {
	if (isLoading) return; 
	isLoading = true;
	// preload image
	let preload = new Image(); 
	preload.src = work.images[i];
	preload.onload = () => {
		displayImage.style.opacity = 0.2;
		// allow fade out to complete before changing image
		setTimeout(() => {
			displayImage.src = work.images[i];
			displayImage.style.opacity = 1;
			if (work.captions) {
				caption.innerHTML = work.captions[i];
			}
			isLoading = false; 
		}, 200);
	};
}

// create elements in this structure: 
// 	<button class="grid-item">
// 		<img src="assets/images/creations/jewelry/necklace.png">
// 		jewelry
// </button>
function createImage(source) {
	let image = document.createElement('img');
	image.src = source;
	return image; 
}

function createButton(image, text) {
	let button = document.createElement('button');
	button.classList.add('grid-item');
	let textNode = document.createTextNode(text); 
	button.appendChild(image); 
	button.appendChild(textNode);
	grid.appendChild(button);
	return button; 
}

function removeElements() {
	while (grid.firstChild) {
		grid.firstChild.remove(); 
	}
}

function addBreadcrumb(innerHTML, eventHandler, layer) {
	// delete existing breadcrumb layer & any in layers that come after it
	let existingBreadcrumbLayer = nav.querySelector(`[data-layer='${layer}']`);
	if (existingBreadcrumbLayer) {
		deleteBreadcrumbs(existingBreadcrumbLayer);
	}
	// create elements in this structure: 
	// <div data-layer="2">
	// 		> <button>innerHTML</button>
	// </div>
	let breadcrumbDiv = document.createElement('div');
	breadcrumbDiv.setAttribute('data-layer', layer);
	let newNav = document.createElement('button');
	newNav.innerHTML = innerHTML;
	if (layer !== "base") {
		breadcrumbDiv.appendChild(document.createTextNode('>'));
	}
	breadcrumbDiv.appendChild(newNav);
	nav.appendChild(breadcrumbDiv);
	// when clicked, show the category and update breadcrumbs
	newNav.addEventListener('click', () => {
		eventHandler(); 
		if (layer !== "work") {
			closeDisplay(); 
		}
	});
}

function deleteBreadcrumbs(lastElement) {
	let nextSibling = lastElement.nextSibling; 
	while (nextSibling) {
		nextSibling.remove(); 
		nextSibling = lastElement.nextSibling; 
	}
	lastElement.remove(); 
}

function closeDisplay() {
	display.style.display = 'none'; 
	grid.style.opacity = 1; 
	hideDisplayButtons();
	let breadcrumb = nav.querySelector(`[data-layer='work']`);
	if (breadcrumb)
		deleteBreadcrumbs(breadcrumb);
}

function hideDisplayButtons() {
	back.style.display = 'none'; 
	next.style.display = 'none'; 
	caption.style.display = 'none';
}

// open game from creations.html
function openTama(event) {
	event.preventDefault(); 
	let indexTab = window.open('index.html', '_blank');
	indexTab.onload = () => {
		indexTab.document.getElementById('music').dispatchEvent(new MouseEvent('dblclick'));
		indexTab.document.getElementById('heart-btn').click(); 
	}
}