function isValidWithoutErrors(result) {
  expect(result.isValid).toBe(true);
  expect(result.errors).toEqual([]);
}

function isNotValidWithErrors(result) {
  expect(result.isValid).toBe(false);
  expect(result.errors).not.toEqual([]);
}

module.exports = {
  isValidWithoutErrors,
  isNotValidWithErrors,
};
