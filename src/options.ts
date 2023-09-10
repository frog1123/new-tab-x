const settings2 = {
  searchEngine: 'duckduckgo',
  openBookmarkInNewTab: false,
  bgUrl: 'https://source.unsplash.com/E8Ufcyxz514/2400x1823',
  order: ['time', 'search', 'bookmarks']
};

const bgInput = document.getElementById('background-input') as HTMLInputElement;
const orderInput = document.getElementById('order-input') as HTMLInputElement;
const saveBtn = document.getElementById('save') as HTMLButtonElement;

saveBtn.onclick = () => {
  chrome.storage.sync.get(settings2, items => {
    chrome.storage.sync.set({ bgUrl: bgInput.value === '' ? items.bgUrl : bgInput.value }, () => {});
    chrome.storage.sync.set({ order: orderInput.value === '' ? items.order : JSON.parse(orderInput.value) }, () => {});
  });
};
