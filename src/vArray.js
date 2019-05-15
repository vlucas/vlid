const { t } = require('./i18n');
const vBase = require('./vBase');
const validate = require('./validate');

module.exports = class vArray extends vBase {
  constructor() {
    super();

    this._schema;
  }

  _base() {
    return this.rule(Array.isArray, value => t('ARRAY_BASE', value));
  }

  items(schema) {
    this._schema = schema;
    return this;
  }

  min(min, err = null) {
    return this.rule(
      value => value.length >= min,
      value => err || t('ARRAY_RULE_MIN', min)
    );
  }

  max(max, err = null) {
    return this.rule(
      value => value.length <= max,
      value => err || t('ARRAY_RULE_MAX', max)
    );
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
