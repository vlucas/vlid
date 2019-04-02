const { t } = require('./i18n');
const GENERIC_ERROR = t('GENERIC_ERROR');

module.exports = function vBase() {
  let _rules = [];
  let _msg = '$1 failed validation';

  return {
    _base() {},

    message(msg) {
      if (!msg) {
        return _msg;
      }
      _msg = msg;
    },

    required() {
      return this.rule(v => v !== undefined && v !== null && v !== '');
    },

    rule(run, message = GENERIC_ERROR) {
      _rules.push({ run, message });
      return this;
    },

    validateSync(data) {
      this._base(); // Always run base validation rule for type

      let results = _rules.map(rule => {
        let msg =
          typeof rule.message === 'function'
            ? rule.message(data)
            : rule.message;

        return rule.run(data) || new Error(msg);
      });
      let errors = results.filter(r => r instanceof Error);
      let isValid = results.every(r => r === true);

      return {
        isValid,
        errors,
      };
    },
  };
};
