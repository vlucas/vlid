const vBase = require('./vBase');
const vNumber = require('./vNumber');
const vString = require('./vString');

function factory(module) {
  return Object.assign(Object.create(vBase()), module);
}

module.exports = {
  any: () => factory({}),
  number: () => factory(vNumber()),
  string: () => factory(vString()),
  validateSync(schema, data) {
    let dt = typeof data;
    let isPlainObject = false;

    if (dt === 'object') {
      let isPlainObject =
        Object.prototype.toString.call(data) === '[object Object]';
    }

    if (data && isPlainObject) {
      let results = Object.keys(schema).map(key => {
        return schema[key].validateSync(data[key]);
      });
      let errors = results.filter(r => r instanceof Error);
      let isValid = results.every(r => r === true);

      return {
        isValid,
        errors,
      };
    }

    return schema.validateSync(data);
  },
};
