const { t } = require('./i18n');
const vBase = require('./vBase');

/* @link https://github.com/manishsaraan/email-validator/blob/master/index.js */
const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

module.exports = class vString extends vBase {
  _base() {
    return this.rule(value => typeof value === 'string', value => t('STRING_BASE', value));
  }

  _cast() {
    return this.cast(String, false);
  }

  alphanum() {
    return this.regex(/^[a-zA-Z0-9]+$/, t('STRING_RULE_ALPHANUM'));
  }

  email(err) {
    return this.rule(function(email) {
      if (!email) return false;

      if (email.length > 254) return false;

      var valid = emailRegex.test(email);
      if (!valid) return false;

      // Further checking of some things regex can't handle
      var parts = email.split('@');
      if (parts[0].length > 64) return false;

      var domainParts = parts[1].split('.');
      if (
        domainParts.some(function(part) {
          return part.length > 63;
        })
      )
        return false;

      return true;
    }, err || t('STRING_RULE_EMAIL'));
  }

  min(len, err = null) {
    return this.rule(value => value.length >= len, err || t('STRING_RULE_MIN', len));
  }

  max(len, err = null) {
    return this.rule(value => value.length <= len, err || t('STRING_RULE_MAX', len));
  }

  regex(pattern, err = null) {
    return this.rule(value => pattern.test(value), err || t('STRING_RULE_REGEX', pattern));
  }

  url(err = null) {
    return this.rule(function validURL(str) {
      var pattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
          '(\\#[-a-z\\d_]*)?$',
        'i'
      ); // fragment locator
      return !!pattern.test(str);
    }, err || t('STRING_RULE_URL'));
  }
};
