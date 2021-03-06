'use strict';

/**
 * @author Adam Patterson <awpatterson217@gmail.com>
 */

const winston = require('winston');
const path = require('path');
const fs = require('fs');

const getDirectories = ({
  root
}) => {
  // TODO: Make async
  if (fs.existsSync(path)) {
    return fs.readdirSync(root, {
      withFileTypes: true
    })
    .filter(obj => obj.isDirectory())
    .map(obj => obj.name)
  }

  return [];
}

const getVersions = ({
  servicePath
}) => {
  const servicePathArr = servicePath.split(`${path.sep}`);

  const rootPath = path.join(...servicePathArr.slice(0, servicePathArr.length - 1));
  const name = servicePathArr.slice(servicePathArr.length - 2, servicePathArr.length - 1);

  return {
    name,
    versions: getDirectories({
      root: rootPath
    }).map((version) => {
      return {
        number: version,
        rootPath: path.join(servicePath, version)
      };
    }),
    getLatest() {
      return this.versions.sort((a, b) => a.number - b.number).reverse().pop();
    },
    getOne({ number }) {
      return this.versions.find(
        (version) => version.number === number
      );
    },
    getAll() {
      return this.versions;
    }
  };
}

// TODO: Add logger and logger path.
// TODO: Create API to get logs from path (JSON?)
// TODO: Find cleaner solution to browser refresh bug.
// TODO: Send custom error file instead of JSON.
const makeServerString = ({
  host,
  port,
  version
}) => `'use strict'

const express = require('express');
const path = require('path');

const app = express();

const appPath = path.join(__dirname, '${version}', 'www');

// For static resources
app.use(express.static(appPath));

// So that paths are handled by Angular routing
app.use((req, res, next) => {
  res.sendFile(path.join(appPath, 'index.html'));
});

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500)
    .json({
      message: err.message,
      error: {}
    });
});

app.listen(${port}, '${host}', () => {
    console.log('Server listening at ${host}:${port}')
});`;

const makeConfigString = ({
  currentVersion,
  localhost,
  localport,
  activeURL,
  description,
  repository
}) => {

  const thisActiveURL = activeURL || `${localhost}:${localport}`;

  return `'use strict'

const { join } = require('path');

module.exports = {
  localhost: '${localhost}',
  localport: ${localport},
  activeURL: '${thisActiveURL}',
  currentVersion: '${currentVersion}',
  description: '${description}',
  repository: '${repository}',
  log: {
    server: {
      path: join(__dirname, '${currentVersion}', 'logs', 'server.txt')
    },
    error: {
      path: join(__dirname, '${currentVersion}', 'logs', 'error.txt')
    }
  }
};`
};

module.exports = {
  makeServerString,
  makeConfigString,
  getVersions
};
