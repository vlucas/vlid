const { t } = require('./i18n');

module.exports = function vNumber() {
  return {
    _base() {
      return this.rule(
        value => typeof value === 'number',
        value => t('NUMBER_BASE', value)
      );
    },

    min(min) {
      return this.rule(
        value => value >= min,
        value => t('NUMBER_RULE_MIN', value, min)
      );
    },

    max(max) {
      return this.rule(
        value => value <= max,
        value => t('NUMBER_RULE_MAX', value, max)
      );
    },
  };
};
