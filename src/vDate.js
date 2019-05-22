const { t } = require('./i18n');
const vBase = require('./vBase');
const { val } = require('./util');

const isoDateRegExp = new RegExp( /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/ );

function isISODate( str ) {
      return isoDateRegExp.test( str );
}

module.exports = class vDate extends vBase {
  _base() {
    return this.rule(isValidDate, value => t('DATE_BASE', value));
  }

  _cast() {
    return this.cast(castToDate, false);
  }

  min(min, err = null) {
    return this.rule(
      value => value >= val(min),
      err ? err : () => t('DATE_RULE_MIN', val(min))
    );
  }

  max(max, err = null) {
    return this.rule(
      value => value <= val(max),
      err ? err : () => t('DATE_RULE_MAX', val(max))
    );
 }

  iso(err = null) {
    this.cast(); // This rule requires casting (ISO-8601 date strings can be parsed)
    this._base = () => {};

    // This ISO rule has to be run on the raw input data, not the cast data
    return this.rule(isISODate, err || t('DATE_RULE_ISO'), { originalValue: true });
  }
};

function isValidDate(d) {
  return d instanceof Date && isFinite(d);
}

function castToDate(input) {
  // If not a date, do some stuff
  if (!(input instanceof Date)) {
    let timestamp = Date.parse(input);

    if (!isNaN(timestamp)) {
      return new Date(timestamp);
    }
  }

  return input;
}
