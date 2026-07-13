const fs = require('fs');
const path = require('path');

const collectionPath = (name) => path.join(__dirname, `${name}.json`);

const readCollection = (name) => {
  const raw = fs.readFileSync(collectionPath(name), 'utf-8');
  return JSON.parse(raw);
};

const writeCollection = (name, data) => {
  fs.writeFileSync(collectionPath(name), JSON.stringify(data, null, 2));
};

const nextId = (records) =>
  records.reduce((max, r) => Math.max(max, r.id), 0) + 1;

module.exports = { readCollection, writeCollection, nextId };
