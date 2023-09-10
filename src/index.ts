const settings = {
  searchEngine: 'duckduckgo',
  openBookmarkInNewTab: false,
  bgUrl: 'https://source.unsplash.com/E8Ufcyxz514/2400x1823'
};

chrome.storage.sync.get(settings, async items => {
  console.log(items);

  (document.querySelector('body') as HTMLElement).style.background = `url(${items.bgUrl}) center / cover no-repeat fixed`;

  const mainText = document.getElementById('main-text') as HTMLElement;

  setInterval(() => {
    const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const d = new Date();
    let day = weekday[d.getDay()];

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    mainText.textContent = `${day} ${hours}:${minutes}:${seconds}`;
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
    chrome.storage.sync.set({ openBookmarkInNewTab: !items.openBookmarkInNewTab }, () => {});
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
        if (items.openBookmarkInNewTab === true) window.open(item.url, '_blank');
        else window.open(item.url, '_self');
      };

      bookmarks.append(node);
    });
  });
});
