const {exec} = require('child_process');
const fs = require('fs');
const config = require('../config.json');
const path = require('path');
const outputFile = path.join(config.bundleFolder, config.jsBundle);
const indexFile = path.join(__dirname, '../', 'server/views/pages/index.ejs');

const readWithIndex = (filepath) => {
  const content = fs.readFileSync(filepath, 'utf-8');
  const lines = content.split('\n');
  let start = 0;
  let end = 0;

  lines.some((v, i) => {
    if(/.*<!\-\-\s*start\s*js\s*\-\->.*/.test(v)) {
      start = i;
      return true;
    }
  });

  lines.some((v, i) => {
    if(/.*<!\-\-\s*end\s*js\s*\-\->.*/.test(v)) {
      end = i;
      return true;
    }
  });

  return {
    start, end, content,
  };
};

const prepare = () => {
  const result = readWithIndex(indexFile);
  const {start, end, content} = result;
  let baseContent = '';
  if(start === end - 1) {
    console.log('nothing need to do.');
    return fs.writeFileSync(indexFile, content);
  } else {
    const lines = content.split('\n');
    const leftHalf = lines.slice(0, start + 1);
    const rightHalf = lines.slice(end, lines.length);
    baseContent = leftHalf.concat(rightHalf).join('\n');
  }
  return fs.writeFileSync(indexFile, baseContent);
};

const add = (newItem) => {
  const result = readWithIndex(indexFile);
  const {start, end, content} = result;
  const lines = content.split('\n');

  const left = lines.slice(0, end);
  const leftPlusNewScript = left.concat(newItem);
  const excludeApp = leftPlusNewScript.filter(v => v.search('app.js') === -1);
  const appjs = leftPlusNewScript.filter(v => ~v.search('app.js'));
  const all = excludeApp.concat(appjs).concat(lines.slice(end, lines.length));

  let newContent =  all.join('\n');
  return fs.writeFileSync(indexFile, newContent);
};

prepare();
add(`<script src="/${config.bundleFolder}/${config.jsBundle}"></script>`);

exec(`npx babel -w src/ --out-file ${outputFile} --source-maps`, (err, stdout, stderr) => {
  if (err) {
    throw new Error(err);
  }
});
