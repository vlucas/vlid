const { t } = require('./i18n');

module.exports = function vNumber() {
  return {
    _base() {
      return this.rule(
        value => typeof value === 'boolean',
        value => t('BOOLEAN_BASE', value)
      );
    },
    _cast() {
      return this.cast(value => {
        let casted = value;
        let vt = typeof value;
        let trueValues = [1, 'true', 't', 'on', 'yes'];
        let falseValues = [0, 'false', 'f', 'off', 'no', ''];

        // Lowercase strings for comparison
        value = vt === 'string' ? value.toLowerCase() : value;

        if (trueValues.includes(value)) {
          casted = true;
        }

        if (falseValues.includes(value)) {
          casted = false;
        }

        return casted;
      });
    },
  };
};

