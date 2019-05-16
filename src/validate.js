const { t } = require('./i18n');

function validateSync(any, data, opts = {}) {
  let errors = [];
  let isValid = true;
  let results = [];
  let castData = data === undefined ? any._default : data;

  if (any._allow !== undefined) {
    let isAllowed = Array.isArray(any._allow) ? any._allow.includes(castData) : any._allow === castData;

    if (isAllowed) {
      return {
        data: castData,
        errors: [],
        isValid: true,
      };
    }
  }

  // Cast value if specified (strict by default)
  if (any._doCast || opts._doCast) {
    any._casts.forEach(cb => castData = cb(castData));
  }

  // Array = If ANY validation rules passes, the whole thing passes
  if (Array.isArray(any)) {
    results = any.map(schema => validateSync(schema, data));
    isValid = results.some(r => r.isValid === true);

    // Clear errors if isValid (at least one rule returned true)
    errors = isValid ? [] : results.filter(r => r.errors.length > 0)
      .map(r => r.errors)
      .reduce((acc, val) => acc.concat(val), []);

    // Return a single error
    if (errors.length > 0) {
      errors = [new Error(t('GENERIC_ERROR_MULTIPLE') + ': (' + errors.map(e => e.message).join(') ' + t('GENERIC_OR') + ' (') + ')')];
    }
  // Normal single validation
  } else {
    results = any._rules.map(rule => {
      let ruleData = rule.rawData ? data : castData;
      let msg =
        typeof rule.message === 'function'
        ? rule.message(ruleData, opts)
        : rule.message;

      return rule.run(ruleData) || new Error(msg);
    });
    errors = results.filter(r => r instanceof Error);
    isValid = results.every(r => r === true);
  }

  return {
    data: castData,
    errors,
    isValid,
  };
}

module.exports = { validateSync };
