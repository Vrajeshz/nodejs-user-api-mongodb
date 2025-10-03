const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = Object.values(err.keyValue)[0]; // Extract only the value
  const message = `Duplicate field value: "${value}". Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  console.log('First Here .', err);
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid Input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 404);

const handleJWTExpiredError = () =>
  new AppError('Your token is expired. Please log in again!', 404);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    errName: err.name,
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (err, res) => {
  //operational, trusted error : send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programming or other unknow error: don't leek error details
  } else {
    // 1) Log Error
    console.log(`Error 💥💥 ${err}`);

    // 2) send generic message
    res.status(500).json({
      status: 'Error',
      message: 'Someting went very wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.create(err);

    if (error.name == 'CastError') error = handleCastErrorDB(error);
    if (error.code == 11000) error = handleDuplicateFieldsDB(error);
    if (error.name == 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name == 'JsonWebTokenError') error = handleJWTError();
    if (error.name == 'TokenExpiredError') error = handleJWTExpiredError();

    console.log('Error object:', err);
    sendErrorProd(error, res);
  }
};
