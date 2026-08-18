const multer = require('multer');

function errorHandler(err, req, res, next) {
  let status = err.status || err.statusCode || 500;
  let message = err.expose ? err.message : 'Internal server error';

  if (err instanceof multer.MulterError) {
    status = 400;
    message = `Upload error: ${err.message}`;
  } else if (err.code === 'ER_DUP_ENTRY') {
    status = 409;
    message = 'Duplicate entry — record already exists';
  } else if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    status = 400;
    message = 'Referenced record does not exist';
  }

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({ error: message });
}

module.exports = errorHandler;
