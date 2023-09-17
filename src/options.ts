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

// type Property = (typeof globalThis.settings)['general'];

const setValue = async <T extends keyof typeof globalThis.settings, K extends keyof (typeof globalThis.settings)[T]>(
  items: typeof globalThis.settings,
  category: T,
  property: K,
  value: (typeof globalThis.settings)[T][K]
): Promise<typeof globalThis.settings> => {
  return new Promise((resolve, reject) => {
    if (value !== null && value !== undefined && value !== '') {
      let categoryToAdd: any = { ...items };
      let propertyToAdd: any = { ...items[category] };
      propertyToAdd[property] = value;
      categoryToAdd[category] = propertyToAdd;

      console.log(property, 'intermediate', items[category]);

      chrome.storage.sync.set<typeof globalThis.settings>(categoryToAdd, () => {
        chrome.storage.sync.get<typeof globalThis.settings>(globalThis.settings, items => {
          console.log(property, items[category]);
          resolve(items);
        });
      });
    } else resolve(items);
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

  chrome.storage.sync.get<typeof globalThis.settings>(globalThis.settings, items => {
    setValue(items, 'general', 'debugMode', debugMode.checked)
      .then(i => setValue(i, 'general', 'preferredTitle', preferredTitle.value))
      .then(i => setValue(i, 'general', 'bgUrl', bgUrl.value))
      .then(i => setValue(i, 'general', 'accentColor', accentColor.value))
      // .then(i => setValue(i, 'general', 'order', JSON.parse(order.value))) // TODO fix later (quotes messed up)
      .then(i => setValue(i, 'mainText', 'type', type.value as typeof globalThis.settings.mainText.type))
      .then(i => setValue(i, 'mainText', 'font', font.value))
      .then(i => setValue(i, 'mainText', 'militaryTime', militaryTime.checked));
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
