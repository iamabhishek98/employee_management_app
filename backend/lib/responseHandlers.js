const successHandler = (res, msg) => {
  return res.status(200).json({
    status: "success",
    message: msg,
  });
};

const errorHandler = (res, error) => {
  console.log(`Sent error response: ${error}`);

  return res.status(400).json({
    status: "error",
    message: error,
  });
};

exports.successHandler = successHandler;
exports.errorHandler = errorHandler;
