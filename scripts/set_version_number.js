#! /usr/bin/env node
'use strict';

const path = require('path');
const replace = require('replace');

function updatePreCommitHookScript(version) {
  replace({
    regex: /--package-version=[\d.]+/,
    replacement: `--package-version=${version}`,
    paths: [path.join('scripts', 'git', 'pre-commit')],
    silent: true,
  });
}

function updateInstallerScript(version) {
  replace({
    regex: /#define MyAppVersion "[\d.]+"/,
    replacement: `#define MyAppVersion "${version}"`,
    paths: [path.join('scripts', 'installer.iss')],
    silent: true,
  });
}

function updateCppFile(version) {
  const file = path.join('src', 'backend', 'app', 'loot_version.cpp.in');
  const versionParts = version.split('.');

  replace({
    regex: /LootVersion::major = \d+;/,
    replacement: `LootVersion::major = ${versionParts[0]};`,
    paths: [file],
    silent: true,
  });

  replace({
    regex: /LootVersion::minor = \d+;/,
    replacement: `LootVersion::minor = ${versionParts[1]};`,
    paths: [file],
    silent: true,
  });

  replace({
    regex: /LootVersion::patch = \d+;/,
    replacement: `LootVersion::patch = ${versionParts[2]};`,
    paths: [file],
    silent: true,
  });
}

function updateResourceFile(version) {
  const file = path.join('src', 'resource.rc');
  const commaSeparatedVersion = version.replace(/\./g, ', ');

  replace({
    regex: /VERSION \d+, \d+, \d+/g,
    replacement: `VERSION ${commaSeparatedVersion}`,
    paths: [file],
    silent: true,
  });

  replace({
    regex: /Version", "\d+\.\d+\.\d+"/g,
    replacement: `Version", "${version}"`,
    paths: [file],
    silent: true,
  });
}

function main() {
  if (process.argv.length !== 3) {
    console.error('Invalid number of arguments given. Only one argument (the new version number) is expected.');
    process.exit(1);
  }

  const newVersion = process.argv[2];

  if (newVersion.split('.').length !== 3) {
    console.error('The version number must be a three-part semantic version.');
    process.exit(1);
  }

  updatePreCommitHookScript(newVersion);
  updateInstallerScript(newVersion);
  updateCppFile(newVersion);
  updateResourceFile(newVersion);
}

main();
