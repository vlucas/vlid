const { t } = require('./i18n');

function validate(any, data, opts = {}) {
  let results = validateSync(any, data, Object.assign(opts, { _runAsync: true }));

  return Promise.all(results.map(r => r instanceof Promise ? r : Promise.resolve(r)))
    .then(results => formatResults(results, data))
    .then(result => {
      if (!result.isValid) {
        let err = new Error(result.message);

        Object.assign(err, result);

        return Promise.reject(err);
      }

      return result;
    });
}

function validateSync(any, data, opts = {}) {
  let errors = [];
  let isValid = true;
  let message = '';
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

  castData = formatData(any, castData, opts);

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
      message = errors[0].message;
    }

    return {
      data: castData,
      errors,
      message,
      isValid,
    };
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
    let hasPromises = results.filter(r => r instanceof Promise).length > 0;

    if (hasPromises && !opts._runAsync) {
      throw new Error('Cannot return Promise futures from vlid.validateSync()');
    }
  }

  return opts._runAsync ? results : formatResults(results, castData);
}

function formatData(any, data, opts) {
  let castData = data === undefined ? any._default : data;

  // Cast value if specified (strict by default)
  if (any._doCast || opts._doCast) {
    any._casts.forEach(cb => castData = cb(castData));
  }

  return castData;
}

/**
 * Format array of results into a return object
 */
function formatResults(results, data) {
  let message = '';
  let errors = results.filter(r => r instanceof Error);
  let isValid = results.every(r => r === true);

  if (errors.length > 0) {
    message = errors.reduce((acc, err) => acc.concat(err), [])
      .filter(err => err)
      .map(err => err.message)
      .join(', ');
  }

  return {
    data,
    errors,
    message,
    isValid,
  };
}

module.exports = { validate, validateSync };
