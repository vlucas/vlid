const { t } = require('./i18n');
const vBase = require('./vBase');
const validate = require('./validate');
const GENERIC_ERROR = t('GENERIC_ERROR');

module.exports = function vObject(schema) {
  let _rules = [];
  let _schema = schema || {};

  function isObject(value) {
    return (
      typeof value === 'object'
      && Object.prototype.toString.call(value) === '[object Object]'
    );
  }

  return {
    _base() {
      return this.rule(isObject, value => t('OBJECT_BASE', value));
    },

    rule(run, message = GENERIC_ERROR) {
      _rules.push({ run, message });
      return this;
    },

    /**
     * Override base validation
     */
    validateSync(data, opts) {
      let vBaseObj = vBase();
      let results = [];

      this._base();
      results.push(validate.validateSync(_rules, data, opts)); // do base validation

      let dt = typeof data;
      let isPlainObject = false;

      if (dt === 'object') {
        isPlainObject = Object.prototype.toString.call(data) === '[object Object]';
      }

      if (data && isPlainObject) {
        Object.keys(schema).forEach(key => {
          results.push(schema[key].validateSync(data[key], { key }));
        });
      }

      let errors = results.filter(r => r.errors.length > 0);
      let isValid = results.every(r => r.isValid === true);

      return {
        isValid,
        errors,
      };
    },
  };
};
