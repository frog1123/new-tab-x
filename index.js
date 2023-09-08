const searchBar = document.getElementById('search');

searchBar.onkeydown = e => {
  console.log('asdasd');
  console.log(e);
  if (e.key === 'Enter') {
    console.log('ee');
    window.location.replace(`https://duckduckgo.com/?q=${searchBar.value}`);
  }
};
