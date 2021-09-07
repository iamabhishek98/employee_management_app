const { successHandler, errorHandler } = require("../lib/responseHandlers");
const { deleteEmployee } = require("../db/queries");

module.exports = ({ server }) => {
  server.delete("/users/:id", async (req, res) => {
    try {
      const { id } = req.params;

      const user = await deleteEmployee(id);

      if (!user) {
        throw "User not found!";
      }

      return successHandler(res, "User deleted!");
    } catch (error) {
      return errorHandler(res, error);
    }
  });
};
