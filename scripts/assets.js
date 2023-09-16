const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');
const chalk = require('chalk');

const destination = process.argv[2].replace(/--destination=/, '');

const cursor = readFileSync(join(__dirname, '..', 'assets', 'crosshair.svg'));
const upArrow = readFileSync(join(__dirname, '..', 'assets', 'up_arrow.svg'));
const command = readFileSync(join(__dirname, '..', 'assets', 'command.svg'));
const upArrowGray = readFileSync(join(__dirname, '..', 'assets', 'up_arrow_gray.svg'));
const commandGray = readFileSync(join(__dirname, '..', 'assets', 'command_gray.svg'));

try {
  writeFileSync(join(__dirname, '..', destination, 'crosshair.svg'), cursor);
  writeFileSync(join(__dirname, '..', destination, 'up_arrow.svg'), upArrow);
  writeFileSync(join(__dirname, '..', destination, 'command.svg'), command);
  writeFileSync(join(__dirname, '..', destination, 'up_arrow_gray.svg'), upArrowGray);
  writeFileSync(join(__dirname, '..', destination, 'command_gray.svg'), commandGray);

  console.log(`${chalk.green('✔')} created assets`);
} catch (err) {
  console.log(err);
  console.log(`${chalk.red('✘')} failed to create assets`);
}
