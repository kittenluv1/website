const loadingScreen = document.getElementById('loading-screen');
const mainContent = document.getElementById('main-content');
const progressBar = document.getElementById('loading-progress-bar');

// Fetch images from images.json and render them in a 5-column masonry grid
fetch('gallery.json')
  .then(response => response.json())
  .then(images => {
    const gallery = document.getElementById('gallery');
    const loadPromises = [];
    const total = images.length;
    let loaded = 0;

    images.forEach(img => {
      const item = document.createElement('div');
      item.className = 'masonry-item';
      item.style.position = 'relative';

      // create image and update progress on load/error
      const image = document.createElement('img');
      const p = new Promise(resolve => {
        const done = (status) => {
          loaded += 1;
          // update bar to reflect actual progress
          if (progressBar) {
            const pct = Math.round((loaded / total) * 100);
            progressBar.style.width = pct + '%';
          }
          resolve({ status, src: image.src });
        };
        image.onload = () => done('loaded');
        image.onerror = () => done('error');
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

    // Hide loading screen and show main content
    return Promise.all(loadPromises);
  })
  .then(() => {
    if (progressBar) progressBar.style.width = '100%';
    // give the final fill a small moment, then swap views
    setTimeout(() => {
      mainContent.classList.add('visible');
      loadingScreen.classList.add('hidden');
      // remove loader from layout after transition
      setTimeout(() => { loadingScreen.style.display = 'none'; }, 400);
    }, 200);
  })
  .catch(err => {
    mainContent.style.display = 'block';
    loadingScreen.style.display = 'none';
    document.getElementById('gallery').textContent = 'Failed to load images.';
    console.error('Gallery failed to load:', err);
  });
