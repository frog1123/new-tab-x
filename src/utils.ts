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

      const getAverages = (data: any[], day: number) => {
        const first24 = data.slice(day * 24, (day + 1) * 24);
        const avgSum = first24.reduce((a: any, b: any) => a + b, 0);
        const average = (avgSum / 24).toFixed(0);

        return average;
      };

      let times: number[] = [0, 1, 2, 3, 4, 5, 6];

      // for (let i = 0; i < 20; i++) {
      //   const dayCode = new Date(data.hourly.time[i * 24]).getDay();
      //   if (dayCode === 0) {
      //     for (let j = 0; j < 7; j++) {
      //       const dayCode = new Date(data.hourly.time[j * 24]).getDay();
      //       times.push(dayCode);
      //       console.log(dayCode);
      //     }
      //     break;
      //   }
      // }
      console.log(times);

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
            <p ${time === new Date().getDay() ? 'style="background-color: white;"' : ''}>${day}</p>
            <p class="weather-emoji">${emoji}</p>
            <p>${temp}°</p>
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
