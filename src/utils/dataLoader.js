const fs = require('fs');
const path = require('path');

function loadJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function resolveDataPath(relativePath) {
  return path.resolve(__dirname, '..', '..', relativePath);
}

module.exports = { loadJsonFile, resolveDataPath };
