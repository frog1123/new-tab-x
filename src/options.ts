globalThis.settings = {
  general: {
    debugMode: false,
    preferredTitle: 'new tab x',
    bgUrl: `chrome-extension://${chrome.runtime.id}/bg-5.png`,
    accentColor: '#8898de',
    highlightColor: '#6fedd680',
    uiColor: '#ffffff20',
    uiBorderColor: '#ffffff30',
    order: ['main', 'search', 'bookmarks', ['notes', 'weather']],
    animationSpeed: 1,
    animationType: 'down'
  },
  mainText: {
    type: 'time',
    customText: 'custom text',
    font: `'Orbitron', monospace'`,
    mainTextColor: '#fff',
    militaryTime: true,
    includeSeconds: false
  },
  searchBar: {
    searchEngine: 'duckduckgo',
    searchPlaceHolder: 'search',
    searchPlaceHolderAlignment: 'ltr',
    showIcon: true
  },
  bookmarksWidget: {
    openBookmarkInNewTab: true,
    bookmarkRows: 1
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

const body = document.querySelector('body');
let els: { [key: string]: HTMLInputElement };

body!.innerHTML = `${body!.innerHTML}
<main id="main">
  <img id="logo" class="float-animation" src="logo.svg" />
  <h1 id="title-text" class="hidden-text">new tab <span>x</span></h1>
  <div id="hotkeys-info-container">
    <div id="hotkeys-info">
      <div class="hotkey-info hidden-side-text" style="transition-delay: 0ms;">
        <div>
          <img src="up_arrow_gray.svg" />
          <p>U</p>
        </div>
        <p>top</p>
      </div>
      <div class="hotkey-info hidden-side-text" style="transition-delay: 50ms;">
        <div>
          <img src="up_arrow_gray.svg" />
          <p>D</p>
        </div>
        <p>bottom</p>
      </div>
      <div class="hotkey-info hidden-side-text" style="transition-delay: 100ms;">
        <div>
          <img src="up_arrow_gray.svg" />
          <p>S</p>
        </div>
        <p>save</p>
      </div>
      <div class="hotkey-info hidden-side-text" style="transition-delay: 150ms;">
        <div>
          <img src="up_arrow_gray.svg" />
          <p>E</p>
        </div>
        <p>export</p>
      </div>
      <div class="hotkey-info hidden-side-text" style="transition-delay: 200ms;">
        <div>
          <img src="up_arrow_gray.svg" />
          <p>I</p>
        </div>
        <p>import</p>
      </div>
    </div>
  </div>
  <div id="hotkeys-note">
    <img src="up_arrow_gray.svg" />
    <p>CTRL + key</p>
  </div>
  <p class="title-p hidden-text">general</p>
  <div class="line"></div>
  <div id="general-container" class="container"></div>
  <p class="title-p hidden-text">main text</p>
  <div class="line"></div>
  <div id="main-text-container" class="container"></div>
  <p class="title-p hidden-text">search bar</p>
  <div class="line"></div>
  <div id="search-bar-container" class="container"></div>
  
  <p class="title-p hidden-text">bookmarks widget</p>
  <div class="line"></div>
  <div id="bookmarks-widget-container" class="container"></div>
  
  <p class="title-p hidden-text">weather widget</p>
  <div class="line"></div>
  <div id="weather-widget-container" class="container"></div>
  <div id="btns-container">
    <button id="save">
      <p>save</p>
    </button>
    <button id="export">
      <p>export</p>
    </button>
    <button id="import">
      <p>import</p>
    </button>
  </div>
</main>`;

chrome.storage.sync.get<typeof globalThis.settings>(globalThis.settings, items => {
  const html = document.querySelector('html') as HTMLElement;
  html.setAttribute('extension-id', chrome.runtime.id);
  html.setAttribute('extension-version', chrome.runtime.getManifest().version);

  if (items.general.debugMode) console.log(items);

  const generalContainer = document.getElementById('general-container') as HTMLDivElement;
  generalContainer.innerHTML = `${generalContainer.innerHTML}
    <div class="input-containers-container">
      <div class="input-container-toggle">
        <p>debug mode</p>
        <label class="switch">
          <input type="checkbox" id="debugMode" ${items.general.debugMode ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
      </div>
      <div class="input-container">
        <p>preferred title</p>
        <input id="preferredTitle" placeholder="${items.general.preferredTitle}">
      </div>
      <div class="sm-info"> 
          <p>Presets |&nbsp;</p>
          <img src="up_arrow.svg" />
        <p>&nbsp;SHIFT + scroll</p>
      </div>
      <div class="bg-container">
        <div id="bg-opt1"><img src="bg-1.png"></div>
        <div id="bg-opt2"><img src="bg-2.png"></div>
        <div id="bg-opt3"><img src="bg-3.png"></div>
        <div id="bg-opt4"><img src="bg-4.png"></div>
        <div id="bg-opt5"><img src="bg-5.png"></div>
        <div id="bg-opt6"><img src="bg-6.png"></div>
      </div>
      <div class="input-container-large">
        <p>background url</p>
        <input id="bgUrl" placeholder="${items.general.bgUrl}">
      </div>
      <div class="input-container">
        <p>accent color</p>
        <input id="accentColor" placeholder="${items.general.accentColor}">
      </div>
      <div class="input-container">
        <p>highlight color</p>
        <input id="highlightColor" placeholder="${items.general.highlightColor}">
      </div>
      <div class="input-container">
        <p>ui color</p>
        <input id="uiColor" placeholder="${items.general.uiColor}">
      </div>
      <div class="input-container">
        <p>ui border color</p>
        <input id="uiBorderColor" placeholder="${items.general.uiBorderColor}">
      </div>
      <div class="input-container-large">
        <p>order</p>
        <input id="order" placeholder="${JSON.stringify(items.general.order).replace(/"/g, '&quot;')}">
      </div>
      <div class="input-container">
        <p>animation speed</p>
        <input id="animationSpeed" placeholder="${items.general.animationSpeed}">
      </div>
      <div class="input-container">
        <p>animation type</p>
        <input id="animationType" placeholder="${items.general.animationType}">
      </div>
    </div>
  `;

  const other = Array.from(document.querySelectorAll('[id^="bg-opt"]')).map(el => el.id);

  const setBg = (id: string) => {
    const el = document.getElementById(id) as HTMLDivElement;
    other.forEach(el => (document.getElementById(el)!.style.border = '4px solid #fff'));
    const bgSrc = (document.querySelector(`#${id} img`) as HTMLImageElement)!.src;

    (document.getElementById('bgUrl') as HTMLInputElement)!.value = bgSrc;
    el.style.border = '4px solid #6fedd6';
  };

  other.forEach(id => {
    const el = document.getElementById(id) as HTMLDivElement;
    el.onclick = () => setBg(id);
  });

  other.forEach(el => {
    const bgSrc = (document.querySelector(`#${el} img`) as HTMLImageElement)!.src;
    if (items.general.bgUrl === bgSrc) (document.getElementById(el) as HTMLDivElement).style.border = '4px solid #6fedd6';
  });

  const mainTextContainer = document.getElementById('main-text-container') as HTMLDivElement;
  mainTextContainer.innerHTML = `${mainTextContainer.innerHTML}
    <div class="input-containers-container">
      <div class="input-container">
        <p>type (time | date | custom)</p>
        <input id="type" placeholder="${items.mainText.type}">
      </div>
      <div class="input-container-large">
        <p>custom text</p>
        <input id="customText" placeholder="${items.mainText.customText}">
      </div>
      <div class="input-container-large">
        <p>font</p>
        <input id="font" placeholder="${items.mainText.font}">
      </div>
      <div class="input-container">
        <p>main text color</p>
        <input id="mainTextColor" placeholder="${items.mainText.mainTextColor}">
      </div>
      <div class="input-container-toggle">
        <p>military time</p>
        <label class="switch">
          <input type="checkbox" id="militaryTime" ${items.mainText.militaryTime ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
      </div>
      <div class="input-container-toggle">
        <p>include seconds</p>
        <label class="switch">
          <input type="checkbox" id="includeSeconds" ${items.mainText.includeSeconds ? 'checked' : ''}>
          <span class="slider"></span>
      </label>
    </div>
    </div>
  `;

  const searchBarContainer = document.getElementById('search-bar-container') as HTMLDivElement;
  searchBarContainer.innerHTML = `${searchBarContainer.innerHTML}
    <div class="input-containers-container">
      <div class="input-container">
        <p>search engine (google | duckduckgo | bing | yahoo)</p>
        <input id="searchEngine" placeholder="${items.searchBar.searchEngine}">
      </div>
      <div class="input-container">
        <p>search placeholder</p>
        <input id="searchPlaceHolder" placeholder="${items.searchBar.searchPlaceHolder}">
      </div>
      <div class="input-container">
        <p>search placeholder alignment (ltr | rtl | center)</p>
        <input id="searchPlaceHolderAlignment" placeholder="${items.searchBar.searchPlaceHolderAlignment}">
      </div>
      <div class="input-container-toggle">
        <p>show icon</p>
        <label class="switch">
          <input type="checkbox" id="showIcon" ${items.searchBar.showIcon ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
      </div>
    </div>
  `;

  const bookmarksWidgetContainer = document.getElementById('bookmarks-widget-container') as HTMLDivElement;
  bookmarksWidgetContainer.innerHTML = `${bookmarksWidgetContainer.innerHTML}
  <div class="input-containers-container">
    <div class="input-container">
      <p>bookmark rows</p>
      <input id="bookmarkRows" placeholder="${items.bookmarksWidget.bookmarkRows}">
    </div>
  </div>
`;

  const weatherWidgetContainer = document.getElementById('weather-widget-container') as HTMLDivElement;
  weatherWidgetContainer.innerHTML = `${weatherWidgetContainer.innerHTML}
    <div class="input-containers-container">
      <div class="input-container">
        <p>degree (F | C)</p>
        <input id="degreeType" placeholder="${items.weatherWidget.degreeType}">
      </div>
      <div class="input-container">
        <p>latitude</p>
        <input id="latitude" placeholder="${items.weatherWidget.latitude}">
      </div>
      <div class="input-container">
        <p>longitude</p>
        <input id="longitude" placeholder="${items.weatherWidget.longitude}">
      </div>
    </div>
  `;

  els = {
    // general
    debugMode: document.getElementById('debugMode') as HTMLInputElement,
    preferredTitle: document.getElementById('preferredTitle') as HTMLInputElement,
    bgUrl: document.getElementById('bgUrl') as HTMLInputElement,
    accentColor: document.getElementById('accentColor') as HTMLInputElement,
    highlightColor: document.getElementById('highlightColor') as HTMLInputElement,
    uiColor: document.getElementById('uiColor') as HTMLInputElement,
    uiBorderColor: document.getElementById('uiBorderColor') as HTMLInputElement,
    order: document.getElementById('order') as HTMLInputElement,
    animationSpeed: document.getElementById('animationSpeed') as HTMLInputElement,
    animationType: document.getElementById('animationType') as HTMLInputElement,
    // mainText
    type: document.getElementById('type') as HTMLInputElement,
    customText: document.getElementById('customText') as HTMLInputElement,
    font: document.getElementById('font') as HTMLInputElement,
    mainTextColor: document.getElementById('mainTextColor') as HTMLInputElement,
    militaryTime: document.getElementById('militaryTime') as HTMLInputElement,
    includeSeconds: document.getElementById('includeSeconds') as HTMLInputElement,
    // search
    searchEngine: document.getElementById('searchEngine') as HTMLInputElement,
    searchPlaceHolder: document.getElementById('searchPlaceHolder') as HTMLInputElement,
    searchPlaceHolderAlignment: document.getElementById('searchPlaceHolderAlignment') as HTMLInputElement,
    showIcon: document.getElementById('showIcon') as HTMLInputElement,
    // bookmarksWidget
    bookmarkRows: document.getElementById('bookmarkRows') as HTMLInputElement,
    // weatherWidget
    degreeType: document.getElementById('degreeType') as HTMLInputElement,
    latitude: document.getElementById('latitude') as HTMLInputElement,
    longitude: document.getElementById('longitude') as HTMLInputElement
  };
});

const run = (v: any, f: () => void) => {
  console.log('test', v);
  if (v !== null && v !== undefined && v !== '') f();
};

const setValue = async <T extends keyof typeof globalThis.settings, K extends keyof (typeof globalThis.settings)[T]>(
  items: typeof globalThis.settings,
  category: T,
  property: K,
  input: HTMLInputElement,
  value: (typeof globalThis.settings)[T][K]
): Promise<typeof globalThis.settings> => {
  return new Promise(resolve => {
    if (value !== null && value !== undefined && value !== '') {
      let categoryToAdd: any = { ...items };
      let propertyToAdd: any = { ...items[category] };
      propertyToAdd[property] = value;
      categoryToAdd[category] = propertyToAdd;

      chrome.storage.sync.set<typeof globalThis.settings>(categoryToAdd, () => {
        chrome.storage.sync.get<typeof globalThis.settings>(globalThis.settings, items => {
          input.placeholder = value.toString();
          if (value instanceof Array) input.placeholder = JSON.stringify(value); // order
          input.value = '';
          resolve(items);
        });
      });
    } else resolve(items);
  });
};

const saveFunction = () => {
  chrome.storage.sync.get<typeof globalThis.settings>(globalThis.settings, items => {
    const settings: [keyof typeof globalThis.settings, string, HTMLInputElement, any][] = [
      ['general', 'debugMode', els.debugMode, els.debugMode.checked],
      ['general', 'preferredTitle', els.preferredTitle, els.preferredTitle.value],
      ['general', 'bgUrl', els.bgUrl, els.bgUrl.value],
      ['general', 'accentColor', els.accentColor, els.accentColor.value],
      ['general', 'highlightColor', els.highlightColor, els.highlightColor.value],
      ['general', 'uiColor', els.uiColor, els.uiColor.value],
      ['general', 'uiBorderColor', els.uiBorderColor, els.uiBorderColor.value],
      ['general', 'order', els.order, els.order.value ? JSON.parse(els.order.value.replace(/&quot;/g, '"')) : ''],
      ['general', 'animationSpeed', els.animationSpeed, els.animationSpeed.value ? parseFloat(els.animationSpeed.value) : items.general.animationSpeed],
      ['general', 'animationType', els.animationType, els.animationType.value],
      ['mainText', 'type', els.type, els.type.value as typeof globalThis.settings.mainText.type],
      ['mainText', 'customText', els.customText, els.customText.value],
      ['mainText', 'font', els.font, els.font.value],
      ['mainText', 'mainTextColor', els.mainTextColor, els.mainTextColor.value],
      ['mainText', 'militaryTime', els.militaryTime, els.militaryTime.checked],
      ['mainText', 'includeSeconds', els.includeSeconds, els.includeSeconds.checked],
      ['searchBar', 'searchEngine', els.searchEngine, els.searchEngine.value as typeof globalThis.settings.searchBar.searchEngine],
      ['searchBar', 'searchPlaceHolder', els.searchPlaceHolder, els.searchPlaceHolder.value],
      [
        'searchBar',
        'searchPlaceHolderAlignment',
        els.searchPlaceHolderAlignment,
        els.searchPlaceHolderAlignment.value as typeof globalThis.settings.searchBar.searchPlaceHolderAlignment
      ],
      ['searchBar', 'showIcon', els.showIcon, els.showIcon.checked],
      ['bookmarksWidget', 'bookmarkRows', els.bookmarkRows, els.bookmarkRows.value ? parseInt(els.bookmarkRows.value) : items.bookmarksWidget.bookmarkRows],
      ['weatherWidget', 'degreeType', els.degreeType, els.degreeType.value as typeof globalThis.settings.weatherWidget.degreeType],
      ['weatherWidget', 'latitude', els.latitude, els.latitude.value],
      ['weatherWidget', 'longitude', els.longitude, els.longitude.value]
    ];

    let chain = Promise.resolve(items);

    settings.forEach(([section, key, element, value]) => {
      chain = chain.then(i => setValue<typeof section, never>(i, section, key as never, element, value as never));
    });

    alert('options saved');
  });
};

const saveBtn = document.getElementById('save') as HTMLButtonElement;
saveBtn.onclick = async () => {
  saveFunction();
};

const exportFunction = () => {
  chrome.storage.sync.get<typeof globalThis.settings>(globalThis.settings, items => {
    const exportedSave = items;
    const formattedExportedSave = `NEW_TAB_X_SAVE_FORMAT_V${chrome.runtime.getManifest().version}_${window.btoa(unescape(encodeURIComponent(JSON.stringify(exportedSave))))}`;

    navigator.clipboard.writeText(formattedExportedSave);
    alert('save copied to clipboard');
  });
};

const exportBtn = document.getElementById('export') as HTMLButtonElement;
exportBtn.onclick = () => exportFunction();

const setInputValue = (input: HTMLInputElement, value: any) => {
  if (typeof value === 'boolean') input.checked = value;
  else input.value = value;
};

const importFunction = () => {
  const dataToImport = prompt('input your save (this will overwrite your current save)');
  if (dataToImport === null) {
    alert('invalid save (null)');
    return;
  }

  const pattern = `NEW_TAB_X_SAVE_FORMAT_V${chrome.runtime.getManifest().version}_`;

  if (!dataToImport.startsWith(pattern)) {
    alert(`incorrect save version (use NEW_TAB_X_SAVE_FORMAT_V${chrome.runtime.getManifest().version})`);
    return;
  }
  const data: typeof globalThis.settings = JSON.parse(decodeURIComponent(escape(window.atob(dataToImport.replace(pattern, '')))));
  console.log(data);

  // general
  setInputValue(els.debugMode, data.general.debugMode);
  setInputValue(els.preferredTitle, data.general.preferredTitle);
  setInputValue(els.bgUrl, data.general.bgUrl);
  setInputValue(els.accentColor, data.general.accentColor);
  setInputValue(els.highlightColor, data.general.highlightColor);
  setInputValue(els.uiColor, data.general.uiColor);
  setInputValue(els.uiBorderColor, data.general.uiBorderColor);
  setInputValue(els.order, JSON.stringify(data.general.order));
  setInputValue(els.animationSpeed, data.general.animationSpeed);
  setInputValue(els.animationType, data.general.animationType);

  // mainText
  setInputValue(els.type, data.mainText.type);
  setInputValue(els.customText, data.mainText.customText);
  setInputValue(els.font, data.mainText.font);
  setInputValue(els.mainTextColor, data.mainText.mainTextColor);
  setInputValue(els.militaryTime, data.mainText.militaryTime);
  setInputValue(els.includeSeconds, data.mainText.includeSeconds);

  // searchBar
  setInputValue(els.searchEngine, data.searchBar.searchEngine);
  setInputValue(els.searchPlaceHolder, data.searchBar.searchPlaceHolder);
  setInputValue(els.searchPlaceHolderAlignment, data.searchBar.searchPlaceHolderAlignment);
  setInputValue(els.showIcon, data.searchBar.showIcon);

  // bookmarksWidget
  setInputValue(els.bookmarkRows, data.bookmarksWidget.bookmarkRows);

  // weatherWidget
  setInputValue(els.degreeType, data.weatherWidget.degreeType);
  setInputValue(els.latitude, data.weatherWidget.latitude);
  setInputValue(els.longitude, data.weatherWidget.longitude);
};

const importBtn = document.getElementById('import') as HTMLButtonElement;
importBtn.onclick = () => importFunction();

const ePreventDefault = (cb: () => any) => {
  return function (e: any) {
    e.preventDefault();
    cb();
  };
};

document.onkeydown = e => {
  e = e || window.event;

  // u - top
  // d - bottom
  // s - save
  // e - export
  // i - import

  if ((e.ctrlKey || e.metaKey) && e.key === 'u') ePreventDefault(() => window.scrollTo({ top: 0, behavior: 'smooth' }))(e);
  if ((e.ctrlKey || e.metaKey) && e.key === 'd') ePreventDefault(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }))(e);
  if ((e.ctrlKey || e.metaKey) && e.key === 's') ePreventDefault(() => saveFunction())(e);
  if ((e.ctrlKey || e.metaKey) && e.key === 'e') ePreventDefault(() => exportFunction())(e);
  if ((e.ctrlKey || e.metaKey) && e.key === 'i') ePreventDefault(() => importFunction())(e);
};

const hiddenElements = document.querySelectorAll('.hidden-text');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible-text');
    else entry.target.classList.remove('visible-text');
  });
});
hiddenElements.forEach(el => observer.observe(el));

const hiddenSideElements = document.querySelectorAll('.hidden-side-text');
const sideObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible-side-text');
    else entry.target.classList.remove('visible-side-text');
  });
});
hiddenSideElements.forEach(el => sideObserver.observe(el));
