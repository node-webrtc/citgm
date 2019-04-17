'use strict';

const install = require('./install');
const test = require('./test');
const getExecutable = require('./get-executable');

function pkgInstall(context) {
  if (context.options.yarn || context.module.useYarn) {
    return install('yarn', context);
  } else {
    return install('npm', context);
  }
}

function pkgTest(context) {
  if (context.options.yarn || context.module.useYarn) {
    return test('yarn', context);
  } else {
    return test('npm', context);
  }
}

function getPackageManagers() {
  const [npm, yarn] = Promise.all([
    getExecutable('npm'),
    getExecutable('yarn')
  ]);
  return { npm, yarn };
}

module.exports = {
  install: pkgInstall,
  test: pkgTest,
  getPackageManagers
};
