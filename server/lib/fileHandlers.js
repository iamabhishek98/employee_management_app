const papa = require("papaparse");
const { checkValidRows } = require("./validationHandlers");

const parseCsv = (csvFile) => {
  const config = {
    header: true,
    comments: "#",
    dynamicTyping: true,
    skipEmptyLines: true,
  };

  const data = papa.parse(csvFile.buffer.toString("utf-8"), config).data;

  return checkValidRows(data);
};

module.exports = { parseCsv };
