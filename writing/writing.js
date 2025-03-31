const main = document.querySelector('main'); 
const select = document.querySelector('select');
let categories;

document.querySelector('button').addEventListener('click', () => window.location.href = '/');
select.addEventListener('change', function(e) {
	main.replaceChildren(); 
	e.target.value === "All" ? displayAll() : displayCategory(e.target.value);
})

fetch('/writing/writing.json')
	.then(response => response.json())
	.then(data => {
		categories = Object.keys(data); 
		categories.forEach(category => {
			// add category to dropdown
			let option = document.createElement('option');
			option.innerHTML = category;
			select.appendChild(option);
			// display categories
		})
		displayAll();
	});

function displayAll() {
	categories.forEach(category => {
		displayCategory(category);
	})
	select.value = "All";
}

function displayCategory(category) {
	// create category heading
	let h3 = document.createElement('h3');
	h3.innerHTML = category; 
	main.appendChild(h3);
	// append pieces to category subheadings
	let list = document.createElement('ul');
	fetch('/writing/writing.json')
		.then(response => response.json())
		.then (data => {
			data[category].forEach(piece => {
				let item = document.createElement('li');
				let a = document.createElement('a');
				a.href = piece.file;
				a.innerHTML = piece.title; 
				if (piece.target !== undefined) {
					a.target = piece.target;
				}
				item.appendChild(a);
				list.appendChild(item);
			})
		})
	main.appendChild(list);
	select.value = category;
}