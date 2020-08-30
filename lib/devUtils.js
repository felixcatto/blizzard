const sass = require('sass');
const crypto = require('crypto');
const klawSync = require('klaw-sync');

const getWebpackEntries = viewsPath =>
  klawSync(viewsPath)
    .map(el => el.path.replace(`${viewsPath}/`, ''))
    .filter(filepath => filepath.endsWith('client.js'))
    .filter(filepath => {
      const [fileName] = filepath.split('/').slice(-1);
      const isFirstLetterLowerCase = fileName[0] === fileName[0].toLowerCase();
      return isFirstLetterLowerCase;
    });

const generateScopedName = (localName, resourcePath) => {
  const getHash = value => crypto.createHash('sha256').update(value).digest('hex');
  const hash = getHash(`${resourcePath}${localName}`).slice(0, 5);
  return `${localName}--${hash}`;
};

const preprocessCss = (data, filename) => {
  if (!filename.endsWith('module.scss')) return '';
  return sass.renderSync({ file: filename }).css.toString('utf8');
};

module.exports = {
  getWebpackEntries,
  generateScopedName,
  preprocessCss,
};
