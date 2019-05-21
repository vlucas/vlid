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
    this._value;

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
    if (typeof run !== 'function') {
      throw new Error('rule() first argument must be a function. Recieved: ' + typeof run);
    }

    this._rules.push(Object.assign({ run, message }, opts));
    return this;
  }

  value(val) {
    if (val !== undefined) {
      this._value = val;
      return this;
    }

    let castData = this._value === undefined ? this._default : this._value;

    // Cast value if specified (strict by default)
    if (this._doCast) {
      this._casts.forEach(cb => castData = cb(castData));
    }

    return castData;
  }

  validate(data, opts = {}) {
    return validate.validate(this, data, opts);
  }

  validateSync(data, opts = {}) {
    return validate.validateSync(this, data, opts);
  }
};
