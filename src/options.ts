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
    militaryTime: true
  },
  searchBar: {
    searchEngine: 'duckduckgo',
    searchPlaceHolder: 'search',
    searchPlaceHolderAlignment: 'ltr',
    showIcon: false
  },
  bookmarksWidget: {
    openBookmarkInNewTab: true
  },
  notesWidget: {
    notesValue: 'tip: click extensions > new tab x > settings to customize this tab 🚀'
  },
  weatherWidget: {
    degreeType: 'F'
  }
};

chrome.storage.sync.get<typeof globalThis.settings>(globalThis.settings, items => {
  console.log(items);

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
      <div class="input-container-large">
        <p>background url</p>
        <input id="bgUrl" placeholder="${items.general.bgUrl}">
      </div>
      <div class="input-container">
        <p>accent color</p>
        <input id="accentColor" placeholder="${items.general.accentColor}">
      </div>
      <div class="input-container-large">
        <p>order</p>
        <input id="order" placeholder="${JSON.stringify(items.general.order).replace(/"/g, '&quot;')}">
      </div>
    </div>
  `;

  const mainTextContainer = document.getElementById('main-text-container') as HTMLDivElement;
  mainTextContainer.innerHTML = `${mainTextContainer.innerHTML}
    <div class="input-containers-container">
      <div class="input-container">
        <p>type (time | date)</p>
        <input id="type" placeholder="${items.mainText.type}">
      </div>
      <div class="input-container-large">
        <p>font</p>
        <input id="font" placeholder="${items.mainText.font}">
      </div>
      <div class="input-container-toggle">
        <p>military time</p>
        <label class="switch">
          <input type="checkbox" id="militaryTime" ${items.mainText.militaryTime ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
      </div>
    </div>
  `;
});

const run = (v: any, f: () => void) => {
  console.log('test', v);
  if (v !== null && v !== undefined && v !== '') f();
};

type Property = (typeof globalThis.settings)['general'];

const setValueGeneral = async <T extends keyof Property>(
  items: typeof globalThis.settings,
  property: keyof Property,
  value: Property[T]
): Promise<typeof globalThis.settings> => {
  return new Promise((resolve, reject) => {
    if (value !== null && value !== undefined && value !== '') {
      let propertyToAdd: any = { ...items.general };
      propertyToAdd[property] = value;

      console.log(property, 'intermediate', items.general);

      chrome.storage.sync.set<typeof globalThis.settings>({ ...items, general: propertyToAdd }, () => {
        chrome.storage.sync.get<typeof globalThis.settings>(globalThis.settings, items => {
          console.log(property, items.general);
          resolve(items);
        });
      });
    } else {
      resolve(items);
    }
  });
};

const saveBtn = document.getElementById('save') as HTMLButtonElement;
saveBtn.onclick = async () => {
  // general
  const debugMode = document.getElementById('debugMode') as HTMLInputElement;
  const preferredTitle = document.getElementById('preferredTitle') as HTMLInputElement;
  const bgUrl = document.getElementById('bgUrl') as HTMLInputElement;
  const accentColor = document.getElementById('accentColor') as HTMLInputElement;
  const order = document.getElementById('order') as HTMLInputElement;

  // mainText
  const type = document.getElementById('type') as HTMLInputElement;
  const font = document.getElementById('font') as HTMLInputElement;
  const militaryTime = document.getElementById('militaryTime') as HTMLInputElement;

  // items doesnt update
  chrome.storage.sync.get<typeof globalThis.settings>(globalThis.settings, items => {
    setValueGeneral(items, 'debugMode', debugMode.checked)
      .then(i => setValueGeneral(i, 'preferredTitle', preferredTitle.value))
      .then(i => setValueGeneral(i, 'bgUrl', bgUrl.value))
      .then(i => setValueGeneral(i, 'accentColor', accentColor.value))
      .then(i => setValueGeneral(i, 'order', order.value));

    // general
    // general
    // run(debugMode.checked, () => chrome.storage.sync.set<typeof globalThis.settings>({ ...items, general: { ...items.general, debugMode: debugMode.checked } }, () => {}));
    // run(preferredTitle.value, () =>
    //   chrome.storage.sync.set<typeof globalThis.settings>({ ...items, general: { ...items.general, preferredTitle: preferredTitle.value } }, () => {})
    // );
    // run(bgUrl.value, () => chrome.storage.sync.set<typeof globalThis.settings>({ ...items, general: { ...items.general, bgUrl: bgUrl.value } }, () => {}));
    // run(accentColor.value, () => chrome.storage.sync.set<typeof globalThis.settings>({ ...items, general: { ...items.general, bgUrl: accentColor.value } }, () => {}));
    // run(order.value, () => chrome.storage.sync.set<typeof globalThis.settings>({ ...items, general: { ...items.general, bgUrl: order.value } }, () => {}));
    // mainText
    // run(type.value, () =>
    //   chrome.storage.sync.set<typeof globalThis.settings>(
    //     { ...items, mainText: { ...items.mainText, type: type.value as typeof globalThis.settings.mainText.type } },
    //     () => {}
    //   )
    // );
    // run(font.value, () => chrome.storage.sync.set<typeof globalThis.settings>({ ...items, mainText: { ...items.mainText, font: font.value } }, () => {}));
    // run(militaryTime.value, () =>
    //   chrome.storage.sync.set<typeof globalThis.settings>({ ...items, mainText: { ...items.mainText, militaryTime: militaryTime.checked } }, () => {})
    // );
  });

  alert('options saved');
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
