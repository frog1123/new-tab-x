const inital = (items: typeof globalThis.settings) => {
  console.log(
    '%c👁️| new tab enabled %cx\n%clogs can be enabled by enabling debug mode%c',
    'color: #a533e8',
    'background-color: #6fedd6; color: #ffffff; border-radius: 4px; padding-left: 4px; padding-right: 4px;',
    ''
  );
  console.log(
    '%c👁️| new tab enabled %cx\n%clogs can be disbaled by disabling debug mode%c',
    'color: #a533e8',
    'background-color: #6fedd6; color: #ffffff; border-radius: 4px; padding-left: 4px; padding-right: 4px;',
    ''
  );

  if (items.general.debugMode) console.log(`version: ${chrome.runtime.getManifest().version}`);
  if (items.general.debugMode) console.table(items);

  document.title = items.general.preferredTitle;
  (document.querySelector('body') as HTMLElement).style.background = `url(${items.general.bgUrl}) center / cover no-repeat fixed`;

  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = `${style.innerHTML}input:checked + .slider { background-color: ${items.general.accentColor}; }`;
  style.innerHTML = `${style.innerHTML}input:focus + .slider { box-shadow: 0 0 1px ${items.general.accentColor}; }`;
  document.head.appendChild(style);
};

const search = (items: typeof globalThis.settings, e: KeyboardEvent) => {
  const searchBar = document.getElementById('search') as HTMLInputElement;

  if (e.key === 'Enter') {
    switch (items.searchBar.searchEngine) {
      case 'duckduckgo':
        window.location.replace(`https://duckduckgo.com/?q=${searchBar.value}`);
        break;
      case 'google':
        window.location.replace(`https://www.google.com/search?q=${searchBar.value}`);
        break;
    }
  }
};

const runClock = (items: typeof globalThis.settings) => {
  const mainText = document.getElementById('main-text') as HTMLElement;

  setInterval(() => {
    const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const d = new Date();
    let day = weekday[d.getDay()];

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    mainText.textContent = `${day} ${items.mainText.militaryTime === false ? parseInt(hours) % 12 : hours}:${minutes}:${seconds} ${
      items.mainText.militaryTime === false ? (parseInt(hours) > 12 ? 'PM' : 'AM') : ''
    }`;
  }, 100);
};

const setBookmarks = () => {
  chrome.bookmarks.search({}, bookmarkItems => {
    const source = [];
    for (var i = 0; i < bookmarkItems.length; i++) {
      source[i] = bookmarkItems[i];
    }

    const bookmarks = document.getElementById('bookmarks-grid') as HTMLElement;

    source.forEach(item => {
      const node = document.createElement('div');
      const nodeClass = document.createAttribute('class');
      nodeClass.value = 'bookmark';
      node.setAttributeNode(nodeClass);
      const p = document.createElement('p');
      const img = document.createElement('img');
      const imgSrc = document.createAttribute('src');
      imgSrc.value = `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(item.url as string)}&size=${32}`;
      img.setAttributeNode(imgSrc);

      p.textContent = `${item.title}`;

      node.appendChild(img);
      node.appendChild(p);

      node.onclick = () => {
        chrome.storage.sync.get<typeof globalThis.settings>(globalThis.settings, items => {
          if (items.bookmarksWidget.openBookmarkInNewTab === true) window.open(item.url, '_blank');
          else window.open(item.url, '_self');
        });
      };

      bookmarks.append(node);
    });
  });
};

const weatherWidgetScript = (items: typeof globalThis.settings) => {
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${40.73061}&longitude=${-73.935242}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m,precipitation,rain,cloudcover`;

  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      if (items.general.debugMode) console.log(data);

      const loactionApiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${data.latitude}&lon=${data.longitude}`;
      fetch(loactionApiUrl)
        .then(response => response.json())
        .then(data => {
          if (items.general.debugMode) console.log(data);
          const location = `${data.address.city}, ${data.address.country}`;

          const weatherInfo = document.getElementById('weather-info') as HTMLParagraphElement;
          weatherInfo!.innerHTML = `Weather | ${location}`;
        });

      const getAverages = (data: any[]) => {
        let avgArr = [];
        for (let i = 0; i < 7; i += 1) {
          const first24 = data.slice(i * 24, i * 24 + 24);
          const avgSum = first24.reduce((a: any, b: any) => a + b, 0);
          const average = (avgSum / 24).toFixed(0);
          avgArr[avgArr.length] = average;
        }
        return avgArr;
      };

      const days = [0, 1, 2, 3, 4, 5, 6];
      const temps: string[] = getAverages(data.hourly.temperature_2m);
      const windspeeds: string[] = getAverages(data.hourly.windspeed_10m);
      const rains: string[] = getAverages(data.hourly.rain);
      const cloudcovers: string[] = getAverages(data.hourly.cloudcover);

      days.forEach(day => {
        let emoji = '☀️';
        if (parseFloat(windspeeds[day]) > 10) emoji = '🍃';
        if (parseFloat(cloudcovers[day]) > 80) emoji = '☁️';
        if (parseFloat(rains[day]) > 10) emoji = '🌧️';

        const weatherGrid = document.getElementById('weather-grid') as HTMLDivElement;
        weatherGrid.innerHTML = `${weatherGrid.innerHTML}
        <div>
            <p class="weather-emoji">${emoji}</p>
            <p>${temps[day]}°</p>
        </div>`;
      });
    });
};

const fadeAnimation = () => {
  const hiddenElements = document.querySelectorAll('.hidden-el');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible-el');
      else entry.target.classList.remove('visible-el');
    });
  });

  hiddenElements.forEach(el => observer.observe(el));
};
