'use strict';

const install = require('./install');
const test = require('./test');
const getExecutable = require('./get-executable');

function pkgInstall(context, next) {
  if (context.options.yarn || context.module.useYarn) {
    install('yarn', context, next);
  } else {
    install('npm', context, next);
  }
}

function pkgTest(context, next) {
  if (context.options.yarn || context.module.useYarn) {
    test('yarn', context, next);
  } else {
    test('npm', context, next);
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
