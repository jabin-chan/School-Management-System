const createError = require('http-errors');

function requireAdmin(req, res, next) {
  if (req.session && req.session.admin) {
    return next();
  }
  next(createError(401, 'Admin authentication required'));
}

function requireStudent(req, res, next) {
  if (req.session && req.session.student) {
    return next();
  }
  next(createError(401, 'Student authentication required'));
}

module.exports = { requireAdmin, requireStudent };
