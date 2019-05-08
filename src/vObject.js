const { t } = require('./i18n');
const vBase = require('./vBase');
const validate = require('./validate');
const GENERIC_ERROR = t('GENERIC_ERROR');

module.exports = function vObject(schema) {
  let _rules = [];
  let _casts = [];
  let _doCast = false;
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

    cast(on) {
      if (typeof on === 'function') {
        _casts.push(on);
        return this;
      }

      _doCast = on === false ? false : true;
      return this;
    },


    rule(run, message = GENERIC_ERROR) {
      _rules.push({ run, message });
      return this;
    },

    /**
     * Override base validation
     */
    validateSync(data, opts = {}) {
      let vBaseObj = vBase();
      let results = [];
      let shouldCast = opts._doCast || _doCast;
      let vobj = {
        _casts,
        _doCast: shouldCast,
        _rules,
      };

      this._cast();
      this._base();
      results.push(validate.validateSync(vobj, data, opts)); // do base validation

      let dt = typeof data;
      let isPlainObject = false;

      if (dt === 'object') {
        isPlainObject = Object.prototype.toString.call(data) === '[object Object]';
      }

      if (data && isPlainObject) {
        Object.keys(schema).forEach(key => {
          results.push(schema[key].validateSync(data[key], { key, _doCast: shouldCast }));
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
