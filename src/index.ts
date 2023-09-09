let searchEngine = 'duckduckgo';
let openBookmarkInNewTab = false;
// const searchEngine = 'google';

const searchBar = document.getElementById('search') as HTMLInputElement;
console.log(searchEngine);

searchBar.onkeydown = e => {
  if (e.key === 'Enter') {
    switch (searchEngine) {
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

bookmarksNewTabToggle.onclick = () => {
  openBookmarkInNewTab = !openBookmarkInNewTab;
  console.log(openBookmarkInNewTab);
};

chrome.bookmarks.search({}, function (items) {
  const source = [];
  for (var i = 0; i < items.length; i++) {
    source[i] = items[i];
  }
  console.log(source);

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
      if (openBookmarkInNewTab === true) window.open(item.url, '_blank');
      else window.open(item.url, '_self');
    };

    bookmarks.append(node);
  });
});
