module.exports = {
  validateSync: function(any, data, opts = {}) {
      // Cast value if specified (strict by default)
      if (any._doCast || opts._doCast) {
        any._casts.forEach(cb => data = cb(data));
      }

      let results = any._rules.map(rule => {
        let msg =
          typeof rule.message === 'function'
            ? rule.message(data, opts)
            : rule.message;

        return rule.run(data) || new Error(msg);
      });
      let errors = results.filter(r => r instanceof Error);
      let isValid = results.every(r => r === true);

      return {
        data,
        errors,
        isValid,
      };
  },
};
