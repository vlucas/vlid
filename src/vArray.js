const { t } = require('./i18n');
const vBase = require('./vBase');
const validate = require('./validate');

module.exports = class vArray extends vBase {
  constructor(schema = {}) {
    super();

    this._schema = schema || {};
  }

  _base() {
    return this.rule(Array.isArray, value => t('ARRAY_BASE', value));
  }

  items(schema) {
    this._schema = schema;
    return this;
  }

  /**
   * Override base validation
   */
  validateSync(data, opts = {}) {
    let results = [];

    results.push(validate.validateSync(this, data, opts)); // do base validation

    if (!Array.isArray(data)) {
      return {
        data,
        isValid: results[0].isValid,
        errors: results[0].errors,
      };
    }

    if (this._schema) {
      data.forEach((value, index) => {
        results.push(this._schema.validateSync(value));
      });
    }

    let errors = results.filter(r => r.errors.length > 0)
      .map(r => r.errors)
      .reduce((acc, val) => acc.concat(val), []);
    let isValid = results.every(r => r.isValid === true);

    return {
      data,
      isValid,
      errors,
    };
  }
};
