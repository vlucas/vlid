const { t } = require('./i18n');
const vBase = require('./vBase');
const validate = require('./validate');
const GENERIC_ERROR = t('GENERIC_ERROR');

module.exports = class vObject extends vBase {
  constructor(schema = {}) {
    super();

    this._schema = schema || {};
  }

  _base() {
    return this.rule(isObject, value => t('OBJECT_BASE', value));
  }

  /**
   * Override base validation
   */
  validateSync(data, opts = {}) {
    let results = [];
    let shouldCast = opts._doCast || this._doCast;

    results.push(validate.validateSync(this, data, opts)); // do base validation

    let dt = typeof data;
    let isPlainObject = false;

    if (dt === 'object') {
      isPlainObject = Object.prototype.toString.call(data) === '[object Object]';
    }

    if (data && isPlainObject) {
      Object.keys(this._schema).forEach(key => {
        results.push(this._schema[key].validateSync(data[key], { key, _doCast: shouldCast }));
      });
    }

    let errors = results.filter(r => r.errors.length > 0);
    let isValid = results.every(r => r.isValid === true);

    return {
      isValid,
      errors,
    };
  }
};

function isObject(value) {
  return (
    typeof value === 'object'
    && Object.prototype.toString.call(value) === '[object Object]'
  );
}
