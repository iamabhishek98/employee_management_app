const successHandler = (res, msg) => {
  return res.status(200).json({
    status: "success",
    results: msg,
  });
};

const errorHandler = (res, error) => {
  console.log(`Sent error response: ${error}`);

  return res.status(400).json({
    status: "error",
    message: error,
  });
};

module.exports = { successHandler, errorHandler };
