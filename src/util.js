function val(value) {
  return typeof value === 'function' ? value() : value;
}

module.exports = { val };
