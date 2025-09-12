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
		let svg = document.querySelector('svg');
		if (svg) {
			svg.style.fill = 'black';
		}
		h1.classList.remove('glow');
		document.querySelectorAll('a').forEach(link => {
  			link.classList.remove('dark-link');
		});
	} 
	else {
		html.style.backgroundColor = 'white';
		html.style.color = 'white';
		let svg = document.querySelector('svg');
		if (svg) {
			svg.style.fill = 'white';
		}
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

		// tagged articles
		if (articles[i].tag === "blur") {
			content.className = "blur"; 
		}
		if (articles[i].tag === "spiral") {

			const SVG_NS = "http://www.w3.org/2000/svg";
			
			// replace content with svg
			const svg = document.createElementNS(SVG_NS, "svg");
			content = svg;

			// code for spiral
			const spiralText = articles[i].content + " \u2022 "; // add a spacer (bullet) between repeats
  			const repeats = 20;
			
			// Archimedean spiral r = a + b * theta
			const a = 2;           // inner offset (px)
			const b = 4.5;         // spiral 'tightness' (px per radian)
			const turns = 12;       // how many full revolutions
			const step = 0.1;     // radians step for sampling points (smaller = smoother)
			const pad = 24;        // padding (px) around spiral to avoid clipping text
			const fontSize = 20;   // used only to suggest padding size; tune if needed

			// ---------- MATH: compute maximum radius ----------
			// theta_max = turns * 2π
			const thetaMax = turns * 2 * Math.PI;
			// rMax = a + b * theta_max
			const rMax = a + b * thetaMax;

			// make the SVG coordinates positive by placing the spiral center at (rMax + pad, rMax + pad)
			const cx = rMax + pad;
			const cy = rMax + pad;
			const size = (rMax + pad) * 2; // the viewBox will be 0 0 size size

			// ---------- Set viewBox of svg using math (circle-based) ----------
			svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
			svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

			// Build the path (sampled points) centered at cx,cy
			const pts = [];
			for (let theta = 0; theta <= thetaMax + 1e-6; theta += step) {
				const r = a + b * theta;
				const x = cx + r * Math.cos(theta);
				const y = cy + r * Math.sin(theta);
				pts.push([x, y]);
			}
			const d = "M " + pts.map(([x,y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(" L ");

			// <svg id="svg" xmlns="http://www.w3.org/2000/svg">
			// 	<defs>
			// 		<path id="spiral" />
			// 	</defs>
			// <text class="spin">
			// 		<textPath href="#spiral" startOffset="0"></textPath>
			// </text>
			// </svg>

			const defs = document.createElementNS(SVG_NS, "defs");
			const path = document.createElementNS(SVG_NS, "path");
			path.setAttribute("id", "spiral");
			path.setAttribute("d", d);
			path.setAttribute("fill", "none");
			path.setAttribute("stroke", "none");
			defs.appendChild(path);

			const text = document.createElementNS(SVG_NS, "text");
			const textPath = document.createElementNS(SVG_NS, "textPath");
			textPath.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#spiral");
			textPath.setAttribute("startOffset", "0%");
			textPath.textContent = spiralText.repeat(repeats);
			text.classList.add("spin");
			text.appendChild(textPath);

			// add the star
			// const star = document.createElementNS(SVG_NS, "text");
			// star.setAttribute("x", cx);
			// star.setAttribute("y", cy + fontSize / 2); // adjust for baseline
			// star.setAttribute("text-anchor", "middle");
			// star.setAttribute("font-size", fontSize * 2);
			// star.textContent = "☆";
			// svg.appendChild(star);

			// // ---------- Animate the text moving along the path ----------
			// --- Text buffer ---
			const pathLength = path.getTotalLength();
			const repeatCount = Math.ceil(pathLength / (spiralText.length * fontSize)) + 2;
			let buffer = spiralText.repeat(repeatCount); // starting text
			textPath.textContent = buffer;

			let pixelCounter = 0;
			const speed = 0.2; // px per frame

			function animate() {
			pixelCounter += speed;

			// when enough pixels = 1 char, rotate string by 1 char
			if (pixelCounter >= fontSize) {
				// take first char and move it to the end
				buffer = buffer.slice(1) + buffer[0];
				textPath.textContent = buffer;

				pixelCounter -= fontSize;
			}

			requestAnimationFrame(animate);
			}

			animate();

			svg.appendChild(defs);
			svg.appendChild(text);
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