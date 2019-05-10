module.exports = {
  validateSync: function(any, data, opts = {}) {
    let castData = data;

    // Cast value if specified (strict by default)
    if (any._doCast || opts._doCast) {
      any._casts.forEach(cb => castData = cb(castData));
    }

    let results = any._rules.map(rule => {
      let ruleData = rule.rawData ? data : castData;
      let msg =
        typeof rule.message === 'function'
        ? rule.message(ruleData, opts)
        : rule.message;

      return rule.run(ruleData) || new Error(msg);
    });
    let errors = results.filter(r => r instanceof Error);
    let isValid = results.every(r => r === true);

    return {
      data: castData,
      errors,
      isValid,
    };
  },
};
