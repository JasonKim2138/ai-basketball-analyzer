
function validateSignup(data) {

  const errors = {};

  if (
    typeof data.email !== "string" ||
    data.email.trim() === ""
  ) {
    errors.email = "Email must be a non-empty string";
  }

  if (
    typeof data.password !== "string" ||
    data.password.length < 8
  ) {
    errors.password = "Password must be a string with at least 8 characters";
  }

  return errors;
}


function validateLogin(data) {

  const errors = {};

  if (
    typeof data.email !== "string" ||
    data.email.trim() === ""
  ) {
    errors.email = "Email must be a non-empty string";
  }

  if (
    typeof data.password !== "string" ||
    data.password.length === 0
  ) {
    errors.password = "Password must be a non-empty string";
  }

  return errors;
}


module.exports = {
  validateSignup,
  validateLogin
};
