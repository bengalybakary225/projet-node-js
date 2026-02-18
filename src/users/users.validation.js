function isNotEmptyString(value) {
  /* pour s'assurer que le nom entrer est non vide et est un string*/
  return typeof value === "string" && value.length > 0;
}

function isEmail(value) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+.[^\s@]+$/.test(value);
}

function isStrongPassword(value) {
  return typeof value === "string" && value.length >= 8;
}

export function validateUser(userData) {
  const errors = {};

  const email = userData.email;
  const password = userData.password;
  const name = userData.name;

  if (!isEmail(email)) errors.email = "Email is invalid";
  if (!isStrongPassword(password)) errors.password = "Password is invalid";
  if (!isNotEmptyString(name)) errors.name = "name is invalid";

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    data: userData,
  };
}
