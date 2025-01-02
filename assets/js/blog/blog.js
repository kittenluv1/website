
document.getElementById('index').addEventListener('click', () => window.location.href = '/index.html');

//populate articles
const div = document.getElementsByTagName('div')[0]; 
for (let i = 0; i < articles.length; i++) {
	//create html elements for an article
	let article = document.createElement('article'); 
	article.id = i; 
	let title = document.createElement('h2'); 
	let date = document.createElement('span'); 
	let content = document.createElement('pre'); 
	//parse in content from javascript object
	if (articles[i].title === undefined) {
		title.innerHTML = "..."; 
	} else {
		title.innerHTML = articles[i].title; 
	}
	date.innerHTML = articles[i].date;
	content.innerHTML = articles[i].content; 
	if (articles[i].tag !== undefined) {
		article.className = "blur"; 
	}
	//append to html
	article.appendChild(title); 
	article.appendChild(date); 
	article.appendChild(content); 
	div.insertBefore(article, div.firstChildElement); 
}

// populate sidebar
const aside = document.getElementsByTagName('aside')[0]; 
const articleElem = document.getElementsByTagName('article'); 
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
	list.appendChild(a); 
	// add to side bar
	ul.insertBefore(list, ul.firstChildElement);
}