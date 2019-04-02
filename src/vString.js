/* @link https://github.com/manishsaraan/email-validator/blob/master/index.js */
const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

module.exports = function vString() {
  return {
    _base() {
      return this.rule(value => typeof value === 'string');
    },

    alphanum() {
      return this.regex(/^[a-zA-Z0-9]+$/);
    },

    email() {
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
      });
    },

    min(len) {
      return this.rule(value => value.length >= len);
    },

    max(len) {
      return this.rule(value => value.length <= len);
    },

    regex(pattern) {
      return this.rule(value => pattern.test(value));
    },

    url(str) {
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
      });
    },
  };
};
