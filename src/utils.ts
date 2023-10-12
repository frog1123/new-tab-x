const inital = (items: typeof globalThis.settings) => {
  if (!items.general.debugMode)
    console.log(
      '%c👁️| new tab enabled %cx\n%clogs can be enabled by enabling debug mode',
      'color: #a533e8',
      'background-color: #6fedd6; color: #ffffff; border-radius: 4px; padding-left: 4px; padding-right: 4px;',
      ''
    );
  else
    console.log(
      '%c👁️| new tab enabled %cx\n%clogs can be disbaled by disabling debug mode',
      'color: #a533e8',
      'background-color: #6fedd6; color: #ffffff; border-radius: 4px; padding-left: 4px; padding-right: 4px;',
      ''
    );

  if (items.general.debugMode) console.log(`version: ${chrome.runtime.getManifest().version}`);
  if (items.general.debugMode) console.log(items);

  document.title = items.general.preferredTitle;
  (document.querySelector('body') as HTMLElement).style.background = `url(${items.general.bgUrl}) center / cover no-repeat fixed`;

  const html = document.querySelector('html') as HTMLElement;
  html.setAttribute('extension-id', chrome.runtime.id);
  html.setAttribute('extension-version', chrome.runtime.getManifest().version);

  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = `${style.innerHTML}input:checked + .slider { background-color: ${items.general.accentColor}; }`;
  style.innerHTML = `${style.innerHTML}input:focus + .slider { box-shadow: 0 0 1px ${items.general.accentColor}; }`;
  style.innerHTML = `${style.innerHTML}::selection { background: ${items.general.highlightColor} }`;
  document.head.appendChild(style);
};

const search = (items: typeof globalThis.settings, e: KeyboardEvent) => {
  const searchBar = document.getElementById('search') as HTMLInputElement;
  if (searchBar.value === '') return;

  if (e.key === 'Enter') {
    switch (items.searchBar.searchEngine) {
      case 'duckduckgo':
        window.location.replace(`https://duckduckgo.com/?q=${searchBar.value}`);
        break;
      case 'google':
        window.location.replace(`https://www.google.com/search?q=${searchBar.value}`);
        break;
      case 'bing':
        window.location.replace(`https://www.bing.com/search?q=${searchBar.value}`);
        break;
      case 'yahoo':
        window.location.replace(`https://search.yahoo.com/search?p=${searchBar.value}`);
    }
  }
};

const runClock = (items: typeof globalThis.settings) => {
  const type = items.mainText.type;

  if (type === 'custom') {
    const mainText = document.getElementById('main-text') as HTMLElement;
    mainText.textContent = items.mainText.customText;
    return;
  }

  if (type === 'time') {
    const timeLogic = () => {
      const mainText = document.getElementById('main-text') as HTMLElement;
      const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const d = new Date();
      let day = weekday[d.getDay()];

      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      let nHours = parseInt(hours);
      if (parseInt(hours) > 12) nHours = parseInt(hours) - 12;

      mainText.textContent = `${day} ${items.mainText.militaryTime === false ? nHours : hours}:${minutes}${items.mainText.includeSeconds ? `:${seconds}` : ''} ${
        items.mainText.militaryTime === false ? (parseInt(hours) > 12 ? 'PM' : 'AM') : ''
      }`;
    };

    timeLogic();
    setInterval(() => timeLogic(), 100);
  }

  if (type === 'date') {
    const dateLogic = () => {
      const mainText = document.getElementById('main-text') as HTMLElement;
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      const currentDate = new Date();
      const dayOfWeek = days[currentDate.getDay()];
      const dayOfMonth = currentDate.getDate();
      const month = months[currentDate.getMonth()];

      mainText.textContent = `${dayOfWeek}, ${dayOfMonth} ${month}`;
    };

    dateLogic();
    setInterval(() => dateLogic(), 1000);
  }
};

const setBookmarks = (items: typeof globalThis.settings) => {
  chrome.bookmarks.search({}, bookmarkItems => {
    const source = [];
    for (let i = 0; i < bookmarkItems.length; i++) {
      source[i] = bookmarkItems[i];
    }

    const bookmarksContainer = document.getElementById('bookmark-grids-grid') as HTMLElement;

    if (source.length === 0) {
      bookmarksContainer.innerHTML = `${bookmarksContainer.innerHTML}
      <div id="no-bookmark-filler">
        <p>You have no bookmarks</p>
      </div>
      `;
      return;
    }

    for (let i = 0; i < items.bookmarksWidget.bookmarkRows; i++) {
      if (source.length > i) bookmarksContainer.innerHTML = `${bookmarksContainer.innerHTML}<div id="bmk-g${i}" class="bookmarks-grid"></div>`;
    }

    source.forEach((item, index) => {
      const _index = index % items.bookmarksWidget.bookmarkRows;

      const bookmarks = document.getElementById(`bmk-g${_index}`) as HTMLDivElement;

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
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${items.weatherWidget.latitude}&longitude=${items.weatherWidget.longitude}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m,precipitation,rain,cloudcover`;

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

          const weatherInfo = document.getElementById('weather-info-location') as HTMLParagraphElement;
          weatherInfo!.innerHTML = `Weather | ${location}`;
        });

      const getAverages = (data: any[], day: number) => {
        const first24 = data.slice(day * 24, (day + 1) * 24);
        const avgSum = first24.reduce((a: any, b: any) => a + b, 0);
        const average = (avgSum / 24).toFixed(0);

        return average;
      };

      let times: number[] = [0, 1, 2, 3, 4, 5, 6];

      times.forEach(time => {
        let day;

        // prettier-ignore
        switch (time) {
          case 0: day = 'S'; break;
          case 1: day = 'M'; break;
          case 2: day = 'T'; break;
          case 3: day = 'W'; break;
          case 4: day = 'T'; break;
          case 5: day = 'F'; break;
          case 6: day = 'S'; break;
        }

        const temp: string = getAverages(data.hourly.temperature_2m, time);
        const windspeed: string = getAverages(data.hourly.windspeed_10m, time);
        const rain: string = getAverages(data.hourly.rain, time);
        const cloudcover: string = getAverages(data.hourly.cloudcover, time);

        let emoji = '☀️';
        if (parseFloat(windspeed) > 10) emoji = '🍃';
        if (parseFloat(cloudcover) > 80) emoji = '☁️';
        if (parseFloat(rain) > 10) emoji = '🌧️';

        // wip

        const weatherGrid = document.getElementById('weather-grid') as HTMLDivElement;
        weatherGrid.innerHTML = `${weatherGrid.innerHTML}
        <div>
            <p ${time === new Date().getDay() ? `id="weather-current-day";` : ''}>${day}</p>
            <p class="weather-emoji">${emoji}</p>
            <p>${items.weatherWidget.degreeType === 'F' ? Math.round((parseFloat(temp) * 9) / 5 + 32) : temp}°</p>
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
