const { t } = require('./i18n');
const validate = require('./validate');
const GENERIC_ERROR = t('GENERIC_ERROR');

module.exports = function vBase() {
  let _rules = [];
  let _casts = [];
  let _doCast = false;
  let _msg = GENERIC_ERROR;

  return {
    _base() {},
    _cast() {},

    cast(on, turnOn = true) {
      if (typeof on === 'function') {
        _casts.push(on);

        if (_doCast === false) {
          _doCast = turnOn;
        }

        return this;
      }

      _doCast = on === false ? false : true;
      return this;
    },

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

    validateSync(data, opts = {}) {
      this._cast(); // Always run casting rules
      this._base(); // Always run base validation rule for type
      let vobj = {
        _casts,
        _doCast,
        _rules,
      };

      return validate.validateSync(vobj, data, opts);
    },
  };
};
