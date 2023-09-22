const { writeFileSync } = require('fs');
const { join } = require('path');
const chalk = require('chalk');

const destination = process.argv[2].replace(/--destination=/, '');

const config = {
  manifest_version: 3,
  version: '1.0.1',
  name: `new tab x ${destination === 'final' ? '' : '(dev)'}`,
  author: 'frog1123',
  description: 'new tab x',
  permissions: ['storage', 'bookmarks', 'favicon'],
  chrome_url_overrides: {
    newtab: 'index.html'
  },
  icons: {
    16: '16.png',
    32: '32.png',
    48: '48.png',
    64: '64.png',
    128: '128.png'
  },
  action: {
    default_icon: {
      16: '16.png',
      32: '32.png',
      48: '48.png',
      64: '64.png',
      128: '128.png'
    },
    default_title: 'new tab x',
    default_popup: 'popup.html'
  },
  options_page: 'options.html'
};

const createManifest = async config => {
  try {
    writeFileSync(join(__dirname, '..', destination, 'manifest.json'), JSON.stringify(config));
    console.log(`${chalk.green('✔')} created manifest.json`);
  } catch (err) {
    console.log(err);
    console.log(`${chalk.red('✘')} failed to create manifest.json`);
  }
};

createManifest(config);
