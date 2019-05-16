const { t } = require('./i18n');
const validate = require('./validate');
const GENERIC_ERROR = t('GENERIC_ERROR');

module.exports = class vBase {
  constructor() {
    this._allow;
    this._default;
    this._rules = [];
    this._casts = [];
    this._doCast = false;

    this._cast(); // Always run casting rules
    this._base(); // Always run base validation rule for type
  }

  // These should be overridden by inheriting classes
  _base() {}
  _cast() {}

  allow(value) {
    this._allow = value;
    return this;
  }

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

  default(value) {
    this._default = value;
    return this.allow(value); // always allow the default value by default
  }

  required(err = null) {
    return this.rule(v => v !== undefined && v !== null && v !== '', err || t('GENERIC_REQUIRED'));
  }

  rule(run, message = GENERIC_ERROR, opts = {}) {
    this._rules.push(Object.assign({ run, message }, opts));
    return this;
  }

  validateSync(data, opts = {}) {
    return validate.validateSync(this, data, opts);
  }
};
