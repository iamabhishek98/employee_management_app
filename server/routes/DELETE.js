const { successHandler, errorHandler } = require("../lib/ResponseHandlers");
const { deleteEmployee } = require("../db/Queries");

module.exports = ({ server }) => {
  server.delete("/users/:id", async (req, res) => {
    try {
      const { id } = req.params;

      const deleteEmployeeResponse = await deleteEmployee(id);

      if (!deleteEmployeeResponse) {
        throw "Employee not found!";
      }

      return successHandler(res, "Employee deleted!");
    } catch (err) {
      return errorHandler(res, err);
    }
  });
};
