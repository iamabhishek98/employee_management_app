const successHandler = (res, msg) => {
  return res.status(200).json({
    status: "success",
    results: msg,
  });
};

const errorHandler = (res, err) => {
  console.log(`Sent error response: ${err}`);

  return res.status(400).json({
    status: "error",
    message: err,
  });
};

module.exports = { successHandler, errorHandler };
