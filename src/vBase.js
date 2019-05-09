const { t } = require('./i18n');
const validate = require('./validate');
const GENERIC_ERROR = t('GENERIC_ERROR');

module.exports = class vBase {
  constructor() {
    this._rules = [];
    this._casts = [];
    this._doCast = false;
    this._msg = GENERIC_ERROR;

    this._cast(); // Always run casting rules
    this._base(); // Always run base validation rule for type
  }

  // These should be overridden by inheriting classes
  _base() {}
  _cast() {}

  cast(on, turnOn = true) {
    if (typeof on === 'function') {
      this._casts.push(on);

      if (this._doCast === false) {
        this._doCast = turnOn;
      }

      return this;
    }

    this._doCast = on === false ? false : true;
    return this;
  }

  message(msg) {
    if (!msg) {
      return this._msg;
    }
    this._msg = msg;
  }

  required() {
    return this.rule(v => v !== undefined && v !== null && v !== '');
  }

  rule(run, message = GENERIC_ERROR) {
    this._rules.push({ run, message });
    return this;
  }

  validateSync(data, opts = {}) {
    return validate.validateSync(this, data, opts);
  }
};
