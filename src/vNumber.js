const { t } = require('./i18n');
const vBase = require('./vBase');

module.exports = class vNumber extends vBase {
  _base() {
    return this.rule(
      value => typeof value === 'number' && !Number.isNaN(value),
      value => t('NUMBER_BASE', value)
    );
  }

  _cast() {
    return this.cast(Number, false);
  }

  min(min, err = null) {
    return this.rule(
      value => value >= min,
      value => err || t('NUMBER_RULE_MIN', min)
    );
  }

  max(max, err = null) {
    return this.rule(
      value => value <= max,
      value => err || t('NUMBER_RULE_MAX', max)
    );
  }
};
