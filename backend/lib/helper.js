// helper functions
const checkValidSalary = (str) => {
  if (isNaN(str)) return false;
  const decimal = parseFloat(str);
  return decimal !== false && decimal >= 0;
};

exports.checkValidSalary = checkValidSalary;
