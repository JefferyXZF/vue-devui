const path = require('path');
const fs = require('fs');
const shell = require('shelljs');
const chalk = require('chalk');
const { isReadyToRelease } = require('../shared/utils');

const log = console.log;

const chalkEslint = chalk.hex('#4b32c3');

const chalkUnitTest = chalk.hex('#99425b');

const chalkError = chalk.hex('#F66F6A');

const chalkSuccess = chalk.hex('#3DCCA6');

const entryDir = path.resolve(__dirname, '../../devui');

const completeComponents = fs.readdirSync(entryDir).filter((name) => {
  const componentDir = path.resolve(entryDir, name);
  const isDir = fs.lstatSync(componentDir).isDirectory();
  return isDir && fs.readdirSync(componentDir).includes('index.ts') && isReadyToRelease(name);
});

const eslintCheckSingle = async (name) => {
  log(chalkEslint(`Start ESLint check ${name}...`));

  const eslintResult = await shell.exec(`eslint --color "./devui/${name}/**/{*.ts,*.tsx}"`);

  if (eslintResult.stdout !== '') {
    shell.echo(chalkError('Error: ESLint failed.'));
    shell.exit(1);
  }

  log(chalkEslint(`ESLint check ${name} finished!`));
};

const eslintCheckSome = async (components) => {
  const componentArr = components.split(',');

  for (const name of componentArr) {
    await eslintCheckSingle(name);
  }

  log(chalkSuccess('Congratulations, all components have passed the ESLint check!'));
};

const eslintCheckAll = async () => {
  for (const name of completeComponents) {
    await eslintCheckSingle(name);
  }

  log(chalkSuccess('Congratulations, all components have passed the ESLint check!'));
};

const eslintCheck = async (components) => {
  log(chalkEslint('Start ESLint check...'));
  if (components) {
    await eslintCheckSome(components);
  } else {
    await eslintCheckAll();
  }
  log(chalkEslint('ESLint check finished!'));
};

const unitTestSingle = async (name) => {
  log(chalkUnitTest(`Start unit test ${name}...`));
  await shell.exec(`pnpm test --filter vue-devui -- --colors --noStackTrace --testMatch **/**/${name}/**/*.spec.{ts,tsx}`);
  log(chalkUnitTest(`Unit test ${name} finished!`));
};

const unitTestSome = async (components) => {
  const componentArr = components.split(',');

  for (const name of componentArr) {
    await unitTestSingle(name);
  }
};

const unitTestAll = async () => {
  for (const name of completeComponents) {
    await unitTestSingle(name);
  }
};

const unitTest = async (components) => {
  log(chalkUnitTest('Start unit test...'));
  if (components) {
    await unitTestSome(components);
  } else {
    await unitTestAll();
  }
  log(chalkUnitTest('Unit test finished!'));
};

exports.codeCheck = async function () {
  const { components, type } = this.opts();

  if (!type) {
    await eslintCheck(components);
    await unitTest(components);
  } else if (type === 'eslint') {
    await eslintCheck(components);
  } else if (type === 'unit-test') {
    await unitTest(components);
  }
};
