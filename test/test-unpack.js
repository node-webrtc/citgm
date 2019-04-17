'use strict';

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const test = require('tap').test;

const tempDirectory = require('../lib/temp-directory');
const unpack = require('../lib/unpack');

const fsStat = promisify(fs.stat);

test('unpack: context.unpack = null', async (t) => {
  const context = {
    unpack: null,
    emit: function() {}
  };

  try {
    unpack(context);
  } catch (err) {
    t.deepEquals(
      err,
      new Error('Nothing to unpack... Ending'),
      'it should error out'
    );
    t.end();
  }
});

test('unpack: context.unpack is invalid path', async (t) => {
  const context = {
    unpack: path.join(__dirname, '..', 'fixtures', 'do-not-exist.tar.gz'),
    emit: function() {}
  };

  try {
    unpack(context);
  } catch (err) {
    t.deepEquals(
      err,
      new Error('Nothing to unpack... Ending'),
      'it should error out'
    );
    t.end();
  }
});

test('unpack: valid unpack', async (t) => {
  const context = {
    module: {
      name: 'omg-i-pass'
    },
    unpack: './test/fixtures/omg-i-pass.tgz',
    emit: function() {}
  };

  // FIXME I am not super convinced that the correct tar ball is being deflated
  // FIXME There is a possibility that the npm cache is trumping this

  await tempDirectory.create(context);

  await unpack(context);
  const stats = await fs.stat(path.join(context.path, 'omg-i-pass'));
  t.ok(stats.isDirectory(), 'the untarred result should be a directory');
  await tempDirectory.remove(context);
  t.end();
});

test('unpack: context.unpack = false', async (t) => {
  const context = {
    unpack: false,
    emit: function() {}
  };

  await unpack(context);
  t.end();
});
