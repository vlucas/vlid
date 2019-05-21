const { t } = require('./i18n');

/**
 * ValidationError class
 */
class ValidationError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, ValidationError);
  }
}

function createError(msg, path = null) {
  let e = new ValidationError(msg);

  e.path = path;

  return e;
}

let _data;
let _refs = [];
function ref(field) {
  let r = () => oget(_data, field);

  _refs.push(r);

  return r;
}

function setData(data) {
  _data = data;
}

/**
 * Async validation function
 *
 * @return Promise
 */
function validate(any, data, opts = {}) {
  let results = validateSync(any, data, Object.assign(opts, { async: true }));

  return Promise.all(results.map(r => r instanceof Promise ? r : Promise.resolve(r)))
    .then(results => formatResults(results, data))
    .then(result => {
      if (!result.isValid) {
        let err = createError(result.message);

        Object.assign(err, result);

        return Promise.reject(err);
      }

      return result;
    });
}

/**
 * Primary validation function
 */
function validateSync(any, data, opts = {}) {
  let path = opts.path || '';
  let errors = [];
  let isValid = true;
  let results = [];
  let castData = data;

  // Array = If ANY validation rules passes, the whole thing passes
  if (Array.isArray(any)) {
    results = any.map(schema => validateSync(schema, data));
    isValid = results.some(r => r.isValid === true);

    // Clear errors if isValid (at least one rule returned true)
    errors = isValid ? [] : results.filter(r => r.errors.length > 0)
      .map(r => r.errors)
      .reduce((acc, val) => acc.concat(val), []);

    // Return a single ValidationError
    if (errors.length > 0) {
      errors = [createError(t('GENERIC_ERROR_MULTIPLE') + ': (' + errors.map(e => e.message).join(') ' + t('GENERIC_OR') + ' (') + ')', path)];
    }

    return {
      data,
      errors,
      isValid,
    };
  // Normal single validation
  } else {
    any.value(data);

    if (opts.cast) {
      any.cast();
    }

    castData = any.value();

    if (_data && opts.path) {
      oset(_data, opts.path, castData);
    }

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

    results = any._rules.map(rule => {
      let ruleData = rule.rawData ? data : castData;
      let msg =
        typeof rule.message === 'function'
        ? rule.message(ruleData, opts)
        : rule.message;

      let ruleResult = rule.run(ruleData) || createError(msg, path);

      return ruleResult;
    });
    let hasPromises = results.filter(r => r instanceof Promise).length > 0;

    if (hasPromises && !opts.async) {
      throw createError('Cannot return Promise futures from vlid.validateSync()', path);
    }
  }

  return opts.async ? results : formatResults(results, castData, opts.path);
}

function flattenErrors(results) {
  return arrayFlatten(results.filter(r => r.errors ? r.errors.length > 0 : r instanceof Error)
      .map(r => r.errors || r));
}

function arrayFlatten(array) {
  return array.reduce((acc, val) => acc.concat(val), []);
}

/**
 * Format array of results into a return object
 */
function formatResults(results, data, path = null) {
  let errors = results.filter(r => r instanceof Error);
  let isValid = results.every(r => r === true);

  let result = {
    data,
    errors,
    isValid,
    path,
  };

  // Show nested results when there is a previous path
  if (!path) {
    result.errors = flattenErrors(results);
    result.results = results.filter(r => r.isValid === false);
    result.isValid = result.errors.length === 0;
  }

  return result;
}

/**
 * Get nested key from provided object
 */
function oget(obj, props) {
  if (typeof props == 'string') {
    props = props.split('.');
  }
  var prop;
  while (props.length) {
    prop = props.shift();
    obj = obj[prop];
    if (!obj) {
      return obj;
    }
  }
  return obj;
}

function oset(obj, props, value) {
  if (typeof props == 'string') {
    props = props.split('.');
  }
  var lastProp = props.pop();
  if (!lastProp) {
    return false;
  }
  var thisProp;
  while ((thisProp = props.shift())) {
    if (typeof obj[thisProp] == 'undefined') {
      obj[thisProp] = {};
    }
    obj = obj[thisProp];
    if (!obj || typeof obj != 'object') {
      return false;
    }
  }
  obj[lastProp] = value;
  return true;
}

module.exports = {
  flattenErrors,
  formatResults,
  oget,
  oset,
  ref,
  setData,
  validate,
  validateSync,
  ValidationError,
};
