function isValidWithoutErrors(result) {
  expect(result.isValid).toBe(true, 'Expected success result');
  expect(result.errors).toEqual([], 'Expected no errors');
}

function isNotValidWithErrors(result) {
  expect(result.isValid).toBe(false, 'Expected error result');
  expect(result.errors).not.toEqual([], 'Expected errors, but got none');
}

module.exports = {
  isValidWithoutErrors,
  isNotValidWithErrors,
};
