const loadingScreen = document.getElementById('loading-screen');
const mainContent = document.getElementById('main-content');
const progressBar = document.getElementById('loading-progress-bar');

// Fetch images from images.json and render them in a 5-column masonry grid
fetch('gallery.json')
  .then(response => response.json())
  .then(images => {
    const gallery = document.getElementById('gallery');
    const loadPromises = [];

    images.forEach(img => {
      const item = document.createElement('div');
      item.className = 'masonry-item';
      item.style.position = 'relative';

      // create image with promise that resolves on load/error
      const image = document.createElement('img');
      const p = new Promise(resolve => {
        image.onload = () => resolve({ status: 'loaded', src: image.src });
        image.onerror = () => resolve({ status: 'error', src: image.src });
      });
      image.src = "images/" + img.url;
      image.alt = img.caption || '';
      loadPromises.push(p);

      item.appendChild(image);
      if (img.caption) {
        const caption = document.createElement('div');
        caption.className = 'caption';
        caption.textContent = img.caption;
        item.appendChild(caption);
      }
      gallery.appendChild(item);
    });

    // start the faux animation to ~95% (1s)
    requestAnimationFrame(() => {
      progressBar.style.width = '95%';
    });

    // Hide loading screen and show main content
    return Promise.all(loadPromises);
  })
  .then(() => {
    progressBar.style.width = '100%';
    mainContent.classList.add('visible');
    loadingScreen.classList.add('hidden');
  })
  .catch(err => {
    mainContent.style.display = 'block';
    loadingScreen.style.display = 'none';
    document.getElementById('gallery').textContent = 'Failed to load images.';
    console.error('Gallery failed to load:', err);
  });
