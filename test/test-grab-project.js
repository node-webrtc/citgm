'use strict';
// FIXME not really a unit test
// FIXME npm should be stubbed
// TODO Test for local module... what does it even mean?

const os = require('os');
const path = require('path');
const fs = require('fs');

const test = require('tap').test;
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');

const grabProject = require('../lib/grab-project');

const sandbox = path.join(os.tmpdir(), `citgm-${Date.now()}`);
const fixtures = path.join(__dirname, 'fixtures');

test('grab-project: setup', (t) => {
  mkdirp(sandbox, (err) => {
    t.error(err);
    t.end();
  });
});

test('grab-project: npm module', async (t) => {
  const context = {
    emit: function() {},
    path: sandbox,
    module: {
      raw: 'omg-i-pass'
    },
    meta: {},
    options: {}
  };
  await grabProject(context);
  fs.stat(context.unpack, (err, stats) => {
    t.error(err);
    t.ok(stats.isFile(), 'The tar ball should exist on the system');
    t.end();
  });
});

test('grab-project: local', async (t) => {
  const context = {
    emit: function() {},
    path: sandbox,
    module: {
      raw: './test/fixtures/omg-i-pass',
      type: 'directory'
    },
    meta: {},
    options: {}
  };
  await grabProject(context);
  fs.stat(context.unpack, (err, stats) => {
    t.error(err);
    t.ok(stats.isFile(), 'The tar ball should exist on the system');
    t.end();
  });
});

test('grab-project: lookup table', async (t) => {
  const context = {
    emit: function() {},
    path: sandbox,
    module: {
      raw: 'lodash'
    },
    meta: {},
    options: {}
  };
  await grabProject(context);
  fs.stat(context.unpack, (err, stats) => {
    t.error(err);
    t.ok(stats.isFile(), 'The tar ball should exist on the system');
    t.end();
  });
});

test('grab-project: local', async (t) => {
  const context = {
    emit: function() {},
    path: sandbox,
    module: {
      raw: 'omg-i-pass',
      type: 'directory'
    },
    options: {}
  };
  process.chdir(fixtures);
  await grabProject(context);
  fs.stat(context.unpack, (err, stats) => {
    t.error(err);
    t.ok(stats.isFile(), 'The tar ball should exist on the system');
    process.chdir(__dirname);
    t.end();
  });
});

test('grab-project: module does not exist', async (t) => {
  const context = {
    emit: function() {},
    path: sandbox,
    module: {
      raw: 'I-DO-NOT-EXIST'
    },
    options: {}
  };
  try {
    await grabProject(context);
  } catch (err) {
    t.equals(err && err.message, 'Failure getting project from npm');
    t.end();
  }
});

test('grab-project: use git clone', async (t) => {
  const context = {
    emit: function() {},
    path: path.join(sandbox, 'git-clone'),
    module: {
      useGitClone: true,
      name: 'omg-i-pass',
      raw: 'https://github.com/MylesBorins/omg-i-pass.git',
      ref: 'v3.0.0'
    },
    options: {}
  };
  await grabProject(context);
  fs.stat(path.join(context.path, 'omg-i-pass/package.json'), (err, stats) => {
    t.error(err);
    t.ok(stats.isFile(), 'The project must be cloned locally');
    t.end();
  });
});

test('grab-project: fail with bad ref', async (t) => {
  const context = {
    emit: function() {},
    path: path.join(sandbox, 'git-bad-ref'),
    module: {
      useGitClone: true,
      name: 'omg-i-pass',
      raw: 'https://github.com/MylesBorins/omg-i-pass.git',
      ref: 'bad-git-ref'
    },
    options: {}
  };
  try {
    await grabProject(context);
  } catch (err) {
    t.equals(
      err && err.message,
      'Command failed: git fetch --depth=1 origin bad-git-ref'
    );
    t.end();
  }
});

test('grab-project: timeout', async (t) => {
  const context = {
    emit: function() {},
    path: sandbox,
    module: {
      name: 'omg-i-pass'
    },
    meta: {},
    options: {
      npmLevel: 'silly',
      timeoutLength: 10
    }
  };
  try {
    await grabProject(context);
  } catch (err) {
    t.equals(err && err.message, 'Download Timed Out');
    t.end();
  }
});

test('grab-project: teardown', (t) => {
  rimraf(sandbox, (err) => {
    t.error(err);
    t.end();
  });
});
