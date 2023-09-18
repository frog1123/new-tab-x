globalThis.settings = {
  general: {
    debugMode: true,
    preferredTitle: 'new tab x',
    bgUrl: 'https://images.hdqwalls.com/wallpapers/anime-night-scenery-8r.jpg',
    accentColor: '#8898de',
    order: ['main', 'search', 'bookmarks', ['notes', 'weather']]
  },
  mainText: {
    type: 'date',
    font: 'Monaco, monospace',
    militaryTime: false
  },
  searchBar: {
    searchEngine: 'duckduckgo',
    searchPlaceHolder: 'search',
    searchPlaceHolderAlignment: 'ltr',
    showIcon: true
  },
  bookmarksWidget: {
    openBookmarkInNewTab: true,
    bookmarkRows: 2
  },
  notesWidget: {
    notesValue: 'tip: click extensions > new tab x > settings to customize this tab 🚀'
  },
  weatherWidget: {
    degreeType: 'F',
    latitude: '40.73061',
    longitude: '-73.935242'
  }
};

// https://images.hdqwalls.com/wallpapers/anime-night-scenery-8r.jpg
// https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.pixelstalk.net%2Fwp-content%2Fuploads%2F2016%2F06%2FWater-Clouds-Nature-Rivers-HD-Wallpaper-1920x1080.jpg&f=1&nofb=1&ipt=e72add54ea927026a6ff29f24be88d867b5b3a5e8cf7b49e94c080de9fe68940&ipo=images

chrome.storage.sync.get<typeof globalThis.settings>(globalThis.settings, async items => {
  inital(items);

  const container = document.getElementById('container') as HTMLDivElement;
  items.general.order.forEach((type: string | [string, string], index: number) => {
    const delay = index * 50 + 'ms';

    if (type instanceof Array) {
      container.innerHTML = `${container.innerHTML}<div id="d${index}-container" class="double-container"></div>`;
      const dContainer = document.getElementById(`d${index}-container`);

      type.forEach(type => {
        switch (type) {
          case 'notes': {
            dContainer!.innerHTML = `${dContainer!.innerHTML}
            <div id="notes" class="double-child hidden-el" style="transition-delay: ${delay};">
              <p>Notes</p>
              <textarea id="notes-input">${items.notesWidget.notesValue}</textarea>
            </div>`;

            break;
          }
          case 'weather': {
            dContainer!.innerHTML = `${dContainer!.innerHTML}
            <div id="weather" class="double-child hidden-el" style="transition-delay: ${delay};">
              <div id="weather-info">
                <p id="weather-info-location">...</p>
                <p>(${items.weatherWidget.degreeType}°)</p>
              </div>
              <div id="weather-grid"></div>
            </div>`;

            weatherWidgetScript(items);
            break;
          }
        }
      });

      return;
    }
    switch (type) {
      case 'main': {
        container.innerHTML = `${container.innerHTML}<h1 id="main-text" class="hidden-el" style="transition-delay: ${delay};">...</h1>`;
        (document.getElementById('main-text') as HTMLElement).style.fontFamily = items.mainText.font;

        if (items.mainText.type === 'time') {
          runClock(items, 'time');
        }

        if (items.mainText.type === 'date') {
          runClock(items, 'date');
        }

        break;
      }
      case 'search': {
        let alignType;

        // prettier-ignore
        switch(items.searchBar.searchPlaceHolderAlignment) {
          case 'rtl': alignType = 'end'; break;
          case 'ltr': alignType = 'start' ; break;
          case 'center': alignType = 'center' ; break;
        }

        container.innerHTML = `${container.innerHTML}
        <div id="search-container" class="hidden-el" ${
          items.searchBar.showIcon
            ? `style="
            grid-template-columns: max-content auto;
            gap: 6px; transition-delay: ${delay};"`
            : `style="transition-delay: ${delay};"`
        }>
          ${items.searchBar.showIcon ? `<img src="${items.searchBar.searchEngine}.png" />` : ''}
          <input id="search" placeholder="${!items.searchBar.searchPlaceHolder ? '' : items.searchBar.searchPlaceHolder}" autocomplete="off" style="text-align: ${alignType};">
        </div>`;

        break;
      }
      case 'bookmarks': {
        container.innerHTML = `${container.innerHTML}
        <div id="bookmarks-container" class="hidden-el" style="transition-delay: ${delay};">
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
          <div id="bookmark-grids-grid"></div>
        </div>`;

        break;
      }
    }
  });

  (document.getElementById('search') as HTMLInputElement).onkeydown = e => search(items, e);

  const bookmarksNewTabToggle = document.getElementById('bookmarks-new-tab-toggle') as any;
  bookmarksNewTabToggle.checked = items.bookmarksWidget.openBookmarkInNewTab;

  bookmarksNewTabToggle.onclick = () => {
    chrome.storage.sync.get<typeof globalThis.settings>(globalThis.settings, items => {
      chrome.storage.sync.set<typeof globalThis.settings>(
        { ...items, bookmarksWidget: { ...items.bookmarksWidget, openBookmarkInNewTab: !items.bookmarksWidget.openBookmarkInNewTab } },
        () => {}
      );
    });
  };

  setBookmarks(items);

  const notesInput = document.getElementById('notes-input') as HTMLInputElement;

  if (notesInput) {
    notesInput.oninput = () =>
      chrome.storage.sync.set<typeof globalThis.settings>({ ...items, notesWidget: { ...items.notesWidget, notesValue: notesInput.value } }, () => {});
  }

  fadeAnimation();
});
