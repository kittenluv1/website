// Fetch images from images.json and render them in a 5-column masonry grid
fetch('gallery.json')
  .then(response => response.json())
  .then(images => {
    const gallery = document.getElementById('gallery');
    images.forEach(img => {
      const item = document.createElement('div');
      item.className = 'masonry-item';
      item.style.position = 'relative';
      const image = document.createElement('img');
      image.src = "images/" + img.url;
      image.alt = img.caption || '';
      item.appendChild(image);
      if (img.caption) {
        const caption = document.createElement('div');
        caption.className = 'caption';
        caption.textContent = img.caption;
        item.appendChild(caption);
      }
      gallery.appendChild(item);
    });
  })
  .catch(err => {
    document.getElementById('gallery').textContent = 'Failed to load images.';
  });
