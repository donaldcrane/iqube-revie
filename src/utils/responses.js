import config from "../config";

function errorResponse(
  res,
  statusCode,
  error,
  message = "An error occurred",
  status = "error"
) {
  const responseObject = {
    status,
    message,
    error,
  };
  config.logger.error(message);
  return res.status(statusCode).send(responseObject);
}

function successResponse(
  res,
  status,
  message,
  data = [],
) {
  const responseObject = {
    status,
    message,
    data,
  };
  config.logger.info(message);
  return res.status(status).send(responseObject);
}

export {
  errorResponse,
  successResponse,
};
