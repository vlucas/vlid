module.exports = {
  validateSync: function(_rules, data, opts) {
      let results = _rules.map(rule => {
        let msg =
          typeof rule.message === 'function'
            ? rule.message(data, opts)
            : rule.message;

        return rule.run(data) || new Error(msg);
      });
      let errors = results.filter(r => r instanceof Error);
      let isValid = results.every(r => r === true);

      return {
        isValid,
        errors,
      };
  },
};
