globalThis.settings = {
  preferredTitle: 'new tab x',
  searchEngine: 'duckduckgo',
  militaryTime: false,
  openBookmarkInNewTab: false,
  notesValue: 'tip: click extensions > new tab x > settings to customize this tab 🚀',
  bgUrl: 'https://images.hdqwalls.com/wallpapers/anime-night-scenery-8r.jpg',
  order: ['time', 'search', 'bookmarks', ['notes', 'weather']]
};

// https://images.hdqwalls.com/wallpapers/anime-night-scenery-8r.jpg
// https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.pixelstalk.net%2Fwp-content%2Fuploads%2F2016%2F06%2FWater-Clouds-Nature-Rivers-HD-Wallpaper-1920x1080.jpg&f=1&nofb=1&ipt=e72add54ea927026a6ff29f24be88d867b5b3a5e8cf7b49e94c080de9fe68940&ipo=images

chrome.storage.sync.get(globalThis.settings, async items => {
  console.log('%c👁️| new tab enabled %cx\n%c', 'color: #a533e8', 'background-color: #6fedd6; color: #ffffff; border-radius: 4px; padding-left: 4px; padding-right: 4px;', '');
  console.table(items);

  document.title = items.preferredTitle;
  (document.querySelector('body') as HTMLElement).style.background = `url(${items.bgUrl}) center / cover no-repeat fixed`;

  const container = document.getElementById('container') as HTMLDivElement;
  items.order.forEach((type: string | [string, string], index: number) => {
    if (type instanceof Array) {
      container.innerHTML = `${container.innerHTML}<div id="d${index}-container" class="double-container"></div>`;
      const dContainer = document.getElementById(`d${index}-container`);

      type.forEach(type => {
        switch (type) {
          case 'notes': {
            dContainer!.innerHTML = `${dContainer!.innerHTML}
            <div id="notes" class="double-child hidden-el">
              <p>Notes</p>
              <textarea id="notes-input"></textarea>
            </div>`;

            chrome.storage.sync.get(globalThis.settings, items => {
              (document.getElementById('notes-input') as HTMLTextAreaElement).value = items.notesValue;
            });
            break;
          }
          case 'weather': {
            dContainer!.innerHTML = `${dContainer!.innerHTML}
            <div id="weather" class="double-child hidden-el">
              <p id="weather-info">...</p>
              <div id="weather-grid"></div>
            </div>`;

            const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${40.73061}&longitude=${-73.935242}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m,precipitation,rain,cloudcover`;

            fetch(apiUrl)
              .then(res => res.json())
              .then(data => {
                console.log(data);

                const loactionApiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${data.latitude}&lon=${data.longitude}`;
                fetch(loactionApiUrl)
                  .then(response => response.json())
                  .then(data => {
                    console.log(data);
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

                const temps: string[] = getAverages(data.hourly.temperature_2m);
                const windspeeds: string[] = getAverages(data.hourly.windspeed_10m);
                const rains: string[] = getAverages(data.hourly.rain);
                const cloudcovers: string[] = getAverages(data.hourly.cloudcover);

                temps.forEach((temp, index) => {
                  const weatherGrid = document.getElementById('weather-grid') as HTMLDivElement;
                  weatherGrid.innerHTML = `${weatherGrid.innerHTML}
                  <div>
                    <p class="weather-emoji">${parseFloat(windspeeds[index]) > 10 ? '🍃' : '☀️'}</p>
                    <p>${temp}°</p>
                  </div>`;
                });
              });
            break;
          }
        }
      });

      return;
    }
    switch (type) {
      case 'time': {
        container.innerHTML = `${container.innerHTML}<h1 id="main-text" class="hidden-el"></h1>`;
        break;
      }
      case 'search': {
        container.innerHTML = `${container.innerHTML}<input id="search" class="hidden-el" placeholder="search" autocomplete="off">`;
        break;
      }
      case 'bookmarks': {
        container.innerHTML = `${container.innerHTML}
        <div id="bookmarks-container" class="hidden-el">
          <div id="bookmarks-info">
            <div> 
              <p>Bookmarks |&nbsp;</p>
              <img src="up_arrow.svg" />
              <p>&nbsp;SHIFT + scroll</p>
            </div>
            <div id="bookmarks-new-tab-info">
              <p>Open in new tab</p>
              <label class="switch">
                <input type="checkbox" id="bookmarks-new-tab-toggle" placeholder="false">
                <span class="slider"></span>
              </label>
            </div>
          </div>
          <div id="bookmarks-grid"></div>
        </div>`;
        break;
      }
    }
  });

  const mainText = document.getElementById('main-text') as HTMLElement;
  setInterval(() => {
    const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const d = new Date();
    let day = weekday[d.getDay()];

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    mainText.textContent = `${day} ${items.militaryTime === false ? parseInt(hours) % 12 : hours}:${minutes}:${seconds} ${items.militaryTime === false ? (parseInt(hours) > 12 ? 'PM' : 'AM') : ''}`;
  }, 100);

  const searchBar = document.getElementById('search') as HTMLInputElement;

  searchBar.onkeydown = e => {
    if (e.key === 'Enter') {
      switch (items.searchEngine) {
        case 'duckduckgo':
          window.location.replace(`https://duckduckgo.com/?q=${searchBar.value}`);
          break;
        case 'google':
          window.location.replace(`https://www.google.com/search?q=${searchBar.value}`);
          break;
      }
    }
  };

  const bookmarksNewTabToggle = document.getElementById('bookmarks-new-tab-toggle') as any;
  bookmarksNewTabToggle.checked = items.openBookmarkInNewTab;

  bookmarksNewTabToggle.onclick = () => {
    chrome.storage.sync.get(globalThis.settings, items => {
      chrome.storage.sync.set({ openBookmarkInNewTab: !items.openBookmarkInNewTab }, () => {});
    });
  };

  chrome.bookmarks.search({}, function (bookmarkItems) {
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
        chrome.storage.sync.get(globalThis.settings, items => {
          if (items.openBookmarkInNewTab === true) window.open(item.url, '_blank');
          else window.open(item.url, '_self');
        });
      };

      bookmarks.append(node);
    });
  });

  const notesInput = document.getElementById('notes-input') as HTMLInputElement;

  if (notesInput) {
    notesInput.oninput = () => chrome.storage.sync.set({ notesValue: notesInput.value }, () => {});
  }

  const hiddenElements = document.querySelectorAll('.hidden-el');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible-el');
      else entry.target.classList.remove('visible-el');
    });
  });

  hiddenElements.forEach(el => observer.observe(el));
});
