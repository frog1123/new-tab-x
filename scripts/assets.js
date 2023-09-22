const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');
const chalk = require('chalk');

const destination = process.argv[2].replace(/--destination=/, '');

const cursor = readFileSync(join(__dirname, '..', 'assets', 'crosshair.svg'));
const upArrow = readFileSync(join(__dirname, '..', 'assets', 'up_arrow.svg'));
const command = readFileSync(join(__dirname, '..', 'assets', 'command.svg'));
const upArrowGray = readFileSync(join(__dirname, '..', 'assets', 'up_arrow_gray.svg'));
const commandGray = readFileSync(join(__dirname, '..', 'assets', 'command_gray.svg'));

const google = readFileSync(join(__dirname, '..', 'assets', 's_icons', 'google.png'));
const duckduckgo = readFileSync(join(__dirname, '..', 'assets', 's_icons', 'duckduckgo.png'));
const bing = readFileSync(join(__dirname, '..', 'assets', 's_icons', 'bing.png'));
const yahoo = readFileSync(join(__dirname, '..', 'assets', 's_icons', 'yahoo.png'));

const bg1 = readFileSync(join(__dirname, '..', 'assets', 'bg', 'bg-1.png'));
const bg2 = readFileSync(join(__dirname, '..', 'assets', 'bg', 'bg-2.png'));
const bg3 = readFileSync(join(__dirname, '..', 'assets', 'bg', 'bg-3.png'));
const bg4 = readFileSync(join(__dirname, '..', 'assets', 'bg', 'bg-4.png'));

try {
  writeFileSync(join(__dirname, '..', destination, 'crosshair.svg'), cursor);
  writeFileSync(join(__dirname, '..', destination, 'up_arrow.svg'), upArrow);
  writeFileSync(join(__dirname, '..', destination, 'command.svg'), command);
  writeFileSync(join(__dirname, '..', destination, 'up_arrow_gray.svg'), upArrowGray);
  writeFileSync(join(__dirname, '..', destination, 'command_gray.svg'), commandGray);

  writeFileSync(join(__dirname, '..', destination, 'google.png'), google);
  writeFileSync(join(__dirname, '..', destination, 'duckduckgo.png'), duckduckgo);
  writeFileSync(join(__dirname, '..', destination, 'bing.png'), bing);
  writeFileSync(join(__dirname, '..', destination, 'yahoo.png'), yahoo);

  writeFileSync(join(__dirname, '..', destination, 'bg-1.png'), bg1);
  writeFileSync(join(__dirname, '..', destination, 'bg-2.png'), bg2);
  writeFileSync(join(__dirname, '..', destination, 'bg-3.png'), bg3);
  writeFileSync(join(__dirname, '..', destination, 'bg-4.png'), bg4);

  console.log(`${chalk.green('✔')} created assets`);
} catch (err) {
  console.log(err);
  console.log(`${chalk.red('✘')} failed to create assets`);
}
