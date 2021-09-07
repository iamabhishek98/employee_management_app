const checkValidSalary = (str) => {
  if (isNaN(str)) return false;
  const decimal = parseFloat(str);
  return decimal !== false && decimal >= 0;
};

const checkValidRows = (rows) => {
  if (!rows.length) {
    throw "Please make sure CSV file is not empty!";
  }

  rows.forEach((row) => {
    if (!(row.id && row.login && row.name && row.salary)) {
      throw "Please check if rows have the correct number of columns!";
    }
    if (!checkValidSalary(row.salary)) {
      throw "Please make sure value entered for salary is properly formatted and valid!";
    }
  });

  return rows;
};

module.exports = { checkValidSalary, checkValidRows };
