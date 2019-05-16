const lang = require('./lang/en');

function t(key, ...args) {
  let i18nString = lang[key];

  if (i18nString === undefined) {
    throw new Error('Missing translation for key ' + key);
  }

  return format(i18nString, args);
}

function format(msg, fields) {
  return fields.reduce(function(msg, currentValue, currentIndex) {
    return msg.replace('$' + (currentIndex + 1), currentValue);
  }, msg);
}

module.exports = {
  t,
  format,
};
