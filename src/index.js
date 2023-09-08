const searchEngine = 'duckduckgo';
// const searchEngine = 'google';

const searchBar = document.getElementById('search');
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

chrome.bookmarks.search({}, function (items) {
  var source = [];
  for (var i = 0; i < items.length; i++) {
    source[i] = items[i];
  }
  console.log(source);

  const bookmarks = document.getElementById('bookmarks-container');

  source.forEach(item => {
    const node = document.createElement('div');
    const nodeClass = document.createAttribute('class');
    nodeClass.value = 'bookmark';
    node.setAttributeNode(nodeClass);
    const p = document.createElement('p');
    p.textContent = `${item.title} ${item.url}`;

    node.appendChild(p);
    bookmarks.append(node);
  });
});
