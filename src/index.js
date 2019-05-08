const vBase = require('./vBase');
const vBoolean = require('./vBoolean');
const vNumber = require('./vNumber');
const vObject = require('./vObject');
const vString = require('./vString');

function factory(module) {
  const vBaseMethods = vBase();
  const methods = Object.assign(vBaseMethods, module);

  const obj = Object.create(methods, {
    vBase: {
      value: vBaseMethods,
    }
  });

  Object.setPrototypeOf(obj, Object.create(vBaseMethods));

  return obj;
}

module.exports = {
  any: () => factory({}),
  boolean: () => factory(vBoolean()),
  number: () => factory(vNumber()),
  object: (obj) => factory(vObject(obj)),
  string: () => factory(vString()),
  validateSync(schema, data) {
    return schema.validateSync(data);
  },
};
