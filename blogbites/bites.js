/*
<entry>
    <div>
        <date>
        <time>
    </div>
    <text>
</entry>
*/

fetch('bites.json')
  .then(response => response.json())
  .then(bites => {
    const container = document.getElementById('container');
    bites.forEach(bite => {
        const entry = document.createElement('div');
        entry.className = 'entry';

        // create date and time elements
        const dateDiv = document.createElement('div');
        dateDiv.className = 'date-div';
        const date = document.createElement('span');
        date.className = 'date';
        const time = document.createElement('span');
        time.className = 'time';
        // parse date and time from JSON
        const d = new Date(bite.date);
        let dateStr = d.toLocaleDateString(undefined, {
            year: 'numeric', month: 'short', day: 'numeric'
        }).replace(/,/g, '');
        date.textContent = dateStr;
        // Show time if the original string includes 'T' (time part)
        if (bite.date.includes('T')) {
            let timeStr = d.toLocaleTimeString(undefined, {
                hour: '2-digit', minute: '2-digit'
            });
            time.textContent = timeStr;
        }
        // append date
        dateDiv.appendChild(date);
        dateDiv.appendChild(time);
        entry.appendChild(dateDiv);

        // create and append text
        const text = document.createElement('p');
        text.className = 'text';
        text.textContent = bite.text;
        entry.appendChild(text);

        container.appendChild(entry);
    })
  });

console.log("pixel art stalls credits: https://markvelyx.itch.io/random-stall-assets")