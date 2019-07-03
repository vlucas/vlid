const { t } = require('./i18n');
const vBase = require('./vBase');
const validate = require('./validate');
const { isPlainObject } = require('./util');

module.exports = class vObject extends vBase {
  constructor(schema = {}) {
    super();

    this._schema = schema || {};
  }

  _base() {
    return this.rule(isPlainObject, value => t('OBJECT_BASE', value));
  }

  /**
   * Override base validation
   */
  validateSync(value, opts = {}) {
    let results = [];
    let shouldCast = opts.cast || this._doCast;

    validate.setData(value);
    results.push(validate.validateSync(this, value, opts)); // do base validation

    if (value && isPlainObject(value)) {
      Object.keys(this._schema).forEach(path => {
        let schema = validate.oget(this._schema, path);
        let val = validate.oget(value, path);
        let nPath = opts.path ? opts.path + '.' + path : path;
        let nOpts = Object.assign({}, opts, { path: nPath, cast: shouldCast });

        if (isPlainObject(schema) && !(schema instanceof vBase)) {
          results.push(new vObject(schema).validateSync(val, nOpts));
        } else {
          results.push(schema.validateSync(val, nOpts));
        }
      });
    }

    return validate.formatResults(results);
  }
};
