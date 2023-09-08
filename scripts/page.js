const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');
const chalk = require('chalk');

const destination = process.argv[2].replace(/--destination=/, '');

const options = readFileSync(join(__dirname, '..', 'src', 'index.html'));

try {
  writeFileSync(join(__dirname, '..', destination, 'index.html'), options);
  console.log(`${chalk.green('✔')} created page`);
} catch (err) {
  console.log(err);
  console.log(`${chalk.red('✘')} failed to create page`);
}
