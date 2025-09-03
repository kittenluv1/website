const div = document.getElementById('articles'); 
const aside = document.getElementsByTagName('aside')[0]; 
const links = document.getElementsByTagName('ul')[0]; 
const articleElem = document.getElementsByTagName('article'); 
const a2024 = document.getElementById('2024');
const a2025 = document.getElementById('2025');
const html = document.querySelector('html');
const h1 = document.querySelector('h1');

document.getElementById('index').addEventListener('click', () => window.location.href = '/');

document.getElementById('mode').addEventListener('click', () => {
	if (html.style.backgroundColor === 'white') {
		html.style.backgroundColor = 'black';
		html.style.color = 'black';
		h1.classList.remove('glow');
		document.querySelectorAll('a').forEach(link => {
  			link.classList.remove('dark-link');
		});
	} 
	else {
		html.style.backgroundColor = 'white';
		html.style.color = 'white';
		h1.classList.add('glow');
		document.querySelectorAll('a').forEach(link => {
  			link.classList.add('dark-link');
		});
	}
})

a2024.addEventListener('click', ()=> {
	updatePage(_2024); 
	a2025.classList.remove('selected'); 
	a2024.classList.add('selected'); 
})
a2025.addEventListener('click', () => {
	updatePage(_2025); 
	a2024.classList.remove('selected'); 
	a2025.classList.add('selected');
})

updatePage(_2025); 

function updatePage(articlesArray) {
	clearPage(); 
	updateArticles(articlesArray);
	updateAside(); 
}

function clearPage() {
	div.replaceChildren(); 
	links.replaceChildren(); 
}

function updateArticles(articles) {
	for (let i = 0; i < articles.length; i++) {
		//create html elements for an article
		let article = document.createElement('article'); 
		article.id = i; 
		let title = document.createElement('h2'); 
		let date = document.createElement('span'); 
		let content = document.createElement('pre'); 

		// title is optional, defaults to "..."
		if (articles[i].title === undefined) {
			title.innerHTML = "..."; 
		} else {
			title.innerHTML = articles[i].title; 
		}
		// date is optional
		if (articles[i].date !== undefined) {
			date.innerHTML = articles[i].date;
		}
		content.innerHTML = articles[i].content; 
		if (articles[i].tag === "blur") {
			content.className = "blur"; 
		}
		//append to html
		article.appendChild(title); 
		article.appendChild(date); 
		article.appendChild(content); 
		div.insertBefore(article, div.firstChildElement); 
	}
}

function updateAside() {
	for (let i = 0; i < articleElem.length; i++) {
		//access the elements & content
		let ul = aside.firstElementChild; 
		let title = articleElem[i].firstElementChild; 
		// create new elements
		let list = document.createElement('li'); 
		let a = document.createElement('a'); 
		let sectionID = i; 
		a.href = `#${sectionID}`; 
		a.innerHTML = title.innerHTML; 
		// Add dark-link class if in dark mode
		if (html.style.backgroundColor === 'white') {
		a.classList.add('dark-link');
		}
		list.appendChild(a); 
		// add to side bar
		ul.insertBefore(list, ul.firstChildElement);
	}
}