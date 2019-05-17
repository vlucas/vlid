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
      return validate.formatResults(results);
    }

    if (this._schema) {
      data.forEach((value, index) => {
        results.push(this._schema.validateSync(value));
      });
    }

    return validate.formatResults(results);
  }
};
