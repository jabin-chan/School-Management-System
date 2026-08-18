const multer = require('multer');
const path = require('path');
const fs = require('fs');
const createError = require('http-errors');

const UPLOAD_ROOT = path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads');

const SUB_DIRS = {
  photo: 'photos',
  tc: 'tc',
  notice: 'notices'
};

Object.values(SUB_DIRS).forEach((dir) => {
  fs.mkdirSync(path.join(UPLOAD_ROOT, dir), { recursive: true });
});

const ACCEPTED_MIME_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  document: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
};

function publicPath(subdir, filename) {
  return filename ? `/uploads/${subdir}/${filename}` : null;
}

function createStorage(subdir) {
  return multer.diskStorage({
    destination(req, file, cb) {
      cb(null, path.join(UPLOAD_ROOT, subdir));
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname).toLowerCase();
      const base = path.basename(file.originalname, ext).replace(/[^a-z0-9]/gi, '_');
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}_${base}${ext || '.bin'}`);
    }
  });
}

function fileFilterFor(kind) {
  return function fileFilter(req, file, cb) {
    const allowed = ACCEPTED_MIME_TYPES[kind] || [];
    if (allowed.includes(file.mimetype)) {
      return cb(null, true);
    }
    cb(createError(400, `Invalid file type '${file.mimetype}'. Allowed: ${allowed.join(', ')}`));
  };
}

module.exports = {
  photoUpload: multer({
    storage: createStorage(SUB_DIRS.photo),
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: fileFilterFor('image')
  }),

  tcUpload: multer({
    storage: createStorage(SUB_DIRS.tc),
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: fileFilterFor('document')
  }),

  noticeUpload: multer({
    storage: createStorage(SUB_DIRS.notice),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: fileFilterFor('document')
  }),

  admissionUpload: multer({
    storage: multer.diskStorage({
      destination(req, file, cb) {
        const subdir = file.fieldname === 'previousSchoolTc' ? SUB_DIRS.tc : SUB_DIRS.photo;
        cb(null, path.join(UPLOAD_ROOT, subdir));
      },
      filename(req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        const base = path.basename(file.originalname, ext).replace(/[^a-z0-9]/gi, '_');
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}_${base}${ext || '.bin'}`);
      }
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilterFor('document')
  }).fields([
    { name: 'photo', maxCount: 1 },
    { name: 'previousSchoolTc', maxCount: 1 }
  ]),

  publicPath
};
