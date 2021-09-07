const db = require("./config");
const Sequelize = require("sequelize");
const Employee = require("./models/Employee");

const fetchEmployee = async (id) => {
  return await Employee.findOne({ where: { id: id }, raw: true });
};

const fetchMultipleEmployees = async (
  minSalary,
  maxSalary,
  sortColumn,
  sortOrder,
  limit,
  offset
) => {
  return await Employee.findAndCountAll({
    where: {
      salary: {
        [Sequelize.Op.between]: [minSalary, maxSalary],
      },
    },
    order: [[sortColumn, sortOrder]],
    limit: limit,
    offset: offset,
    raw: true,
  });
};

const insertEmployee = () => {};

const updateEmployee = () => {};

const deleteEmployee = async (id) => {
  return await Employee.destroy({ where: { id: id }, raw: true });
};

const upsertMultipleEmployees = async (employees) => {
  const t = await db.transaction();

  try {
    await Employee.bulkCreate(
      employees,
      {
        fields: ["id", "login", "name", "salary"],
        updateOnDuplicate: ["id", "login", "name", "salary"],
      },
      { transaction: t }
    );

    await t.commit();

    return true;
  } catch (err) {
    await t.rollback();
  }

  return false;
};

module.exports = {
  fetchEmployee,
  fetchMultipleEmployees,
  insertEmployee,
  updateEmployee,
  deleteEmployee,
  upsertMultipleEmployees,
};
