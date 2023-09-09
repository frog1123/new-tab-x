const settings = {
  searchEngine: 'duckduckgo',
  openBookmarkInNewTab: false
};

chrome.storage.sync.get(settings, async items => {
  console.log(items);

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
