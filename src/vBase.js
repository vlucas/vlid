const { t } = require('./i18n');
const validate = require('./validate');
const GENERIC_ERROR = t('GENERIC_ERROR');

module.exports = function vBase() {
  let _rules = [];
  let _msg = GENERIC_ERROR;

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

    validateSync(data, opts) {
      this._base(); // Always run base validation rule for type

      return validate.validateSync(_rules, data, opts);
    },
  };
};
