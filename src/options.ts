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
          <input type="checkbox" id="debugMode" placeholder="${items.general.debugMode}">
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
    </div>
  `;
});

const run = (v: any, f: () => void) => {
  if (v !== null && v !== undefined && v !== '') f();
};

const saveBtn = document.getElementById('save') as HTMLButtonElement;
saveBtn.onclick = () => {
  // general
  const debugMode = document.getElementById('debugMode') as HTMLInputElement;
  const preferredTitle = document.getElementById('preferredTitle') as HTMLInputElement;
  const bgUrl = document.getElementById('bgUrl') as HTMLInputElement;

  chrome.storage.sync.get<typeof globalThis.settings>(globalThis.settings, items => {
    run(debugMode.checked, () => chrome.storage.sync.set<typeof globalThis.settings>({ ...items, general: { ...items.general, debugMode: debugMode.checked } }, () => {}));
    run(preferredTitle.value, () =>
      chrome.storage.sync.set<typeof globalThis.settings>({ ...items, general: { ...items.general, preferredTitle: preferredTitle.value } }, () => {})
    );
    run(bgUrl.value, () => chrome.storage.sync.set<typeof globalThis.settings>({ ...items, general: { ...items.general, bgUrl: bgUrl.value } }, () => {}));
  });
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
