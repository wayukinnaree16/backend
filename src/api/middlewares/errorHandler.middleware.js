const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const { serverConfig } = require('../../config');

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (!(err instanceof ApiError)) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(serverConfig.env === 'development' && { stack: err.stack }),
  };

  if (serverConfig.env === 'development') {
    console.error(err);
  }

  res.status(statusCode).send(response);
};

module.exports = {
  errorHandler,
}; 