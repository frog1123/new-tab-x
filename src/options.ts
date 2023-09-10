const preferredTitleInput = document.getElementById('preferred-title-input') as HTMLInputElement;
const bgInput = document.getElementById('background-input') as HTMLInputElement;
const orderInput = document.getElementById('order-input') as HTMLInputElement;
const saveBtn = document.getElementById('save') as HTMLButtonElement;

saveBtn.onclick = () => {
  chrome.storage.sync.get(globalThis.settings, items => {
    chrome.storage.sync.set({ preferredTitle: preferredTitleInput.value === '' ? items.preferredTitleInput : preferredTitleInput.value }, () => {});
    chrome.storage.sync.set({ bgUrl: bgInput.value === '' ? items.bgUrl : bgInput.value }, () => {});
    chrome.storage.sync.set({ order: orderInput.value === '' ? items.order : JSON.parse(orderInput.value) }, () => {});
  });
};
