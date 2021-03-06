const successHandler = (res, msg) => {
  return res.status(200).json({
    results: msg,
  });
};

const errorHandler = (res, err) => {
  return res.status(400).json({
    error: err,
  });
};

module.exports = { successHandler, errorHandler };
