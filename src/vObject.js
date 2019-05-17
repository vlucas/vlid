const { t } = require('./i18n');
const vBase = require('./vBase');
const validate = require('./validate');

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
    let shouldCast = opts.cast || this._doCast;

    results.push(validate.validateSync(this, data, opts)); // do base validation

    let dt = typeof data;
    let isPlainObject = false;

    if (dt === 'object') {
      isPlainObject = Object.prototype.toString.call(data) === '[object Object]';
    }

    if (data && isPlainObject) {
      Object.keys(this._schema).forEach(path => {
        results.push(this._schema[path].validateSync(data[path], { path, cast: shouldCast }));
      });
    }

    return validate.formatResults(results);
  }
};

function isObject(value) {
  return (
    typeof value === 'object'
    && Object.prototype.toString.call(value) === '[object Object]'
  );
}
