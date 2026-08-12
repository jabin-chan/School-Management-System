const router = require('express').Router();
const asyncHandler = require('../middleware/asyncHandler');
const validate = require('../middleware/validate');
const { requireAdmin } = require('../middleware/auth');
const { photoUpload, noticeUpload } = require('../middleware/upload');

const { updateStatus } = require('../validators/admissionValidator');
const { createStudent, updateStudent, studentStatus } = require('../validators/studentValidator');
const { createTeacher, updateTeacher } = require('../validators/teacherValidator');
const { createNotice, updateNotice } = require('../validators/noticeValidator');
const { createFee, updateFee, assignToClass, markPaid, markPaidByClass } = require('../validators/feeValidator');
const { createCalendar, updateCalendar } = require('../validators/calendarValidator');
const { createSession, updateSession } = require('../validators/sessionValidator');

const admissionController = require('../controllers/admissionController');
const studentController = require('../controllers/studentController');
const teacherController = require('../controllers/teacherController');
const noticeController = require('../controllers/noticeController');
const feeController = require('../controllers/feeController');
const calendarController = require('../controllers/calendarController');
const sessionController = require('../controllers/sessionController');
const postController = require('../controllers/postController');

router.use(requireAdmin);

router.get('/health', (req, res) => res.json({ message: 'Admin API healthy', admin: req.session.admin }));

router.get('/admissions', asyncHandler(admissionController.list));
router.get('/admissions/:id', asyncHandler(admissionController.get));
router.patch(
  '/admissions/:id/status',
  updateStatus,
  validate,
  asyncHandler(admissionController.updateStatus)
);

router.get('/students', asyncHandler(studentController.list));
router.post(
  '/students',
  photoUpload.single('photo'),
  createStudent,
  validate,
  asyncHandler(studentController.create)
);
router.get('/students/:id', asyncHandler(studentController.get));
router.patch(
  '/students/:id',
  photoUpload.single('photo'),
  updateStudent,
  validate,
  asyncHandler(studentController.update)
);
router.delete('/students/:id', asyncHandler(studentController.remove));
router.patch(
  '/students/:id/status',
  studentStatus,
  validate,
  asyncHandler(studentController.setStatus)
);

router.get('/teachers', asyncHandler(teacherController.list));
router.post(
  '/teachers',
  photoUpload.single('photo'),
  createTeacher,
  validate,
  asyncHandler(teacherController.create)
);
router.get('/teachers/:id', asyncHandler(teacherController.get));
router.patch(
  '/teachers/:id',
  photoUpload.single('photo'),
  updateTeacher,
  validate,
  asyncHandler(teacherController.update)
);
router.delete('/teachers/:id', asyncHandler(teacherController.remove));

router.get('/notices', asyncHandler(noticeController.listAdmin));
router.post(
  '/notices',
  noticeUpload.single('attachment'),
  createNotice,
  validate,
  asyncHandler(noticeController.create)
);
router.get('/notices/:id', asyncHandler(noticeController.get));
router.patch(
  '/notices/:id',
  noticeUpload.single('attachment'),
  updateNotice,
  validate,
  asyncHandler(noticeController.update)
);
router.delete('/notices/:id', asyncHandler(noticeController.remove));

router.get('/fees', asyncHandler(feeController.list));
router.post('/fees', createFee, validate, asyncHandler(feeController.create));
router.get('/fees/:id', asyncHandler(feeController.get));
router.patch('/fees/:id', updateFee, validate, asyncHandler(feeController.update));
router.delete('/fees/:id', asyncHandler(feeController.remove));
router.post('/fees/:id/assign-to-class', assignToClass, validate, asyncHandler(feeController.assignToClass));

router.get('/student-fees', asyncHandler(feeController.listStudentFees));
router.patch('/student-fees/pay', markPaid, validate, asyncHandler(feeController.markPaid));
router.patch('/student-fees/pay-by-class', markPaidByClass, validate, asyncHandler(feeController.markPaidByClass));

router.get('/calendar', asyncHandler(calendarController.list));
router.post('/calendar', createCalendar, validate, asyncHandler(calendarController.create));
router.get('/calendar/:id', asyncHandler(calendarController.get));
router.patch('/calendar/:id', updateCalendar, validate, asyncHandler(calendarController.update));
router.delete('/calendar/:id', asyncHandler(calendarController.remove));

router.get('/sessions', asyncHandler(sessionController.list));
router.post('/sessions', createSession, validate, asyncHandler(sessionController.create));
router.get('/sessions/:id', asyncHandler(sessionController.get));
router.patch('/sessions/:id', updateSession, validate, asyncHandler(sessionController.update));
router.patch('/sessions/:id/current', asyncHandler(sessionController.setCurrent));
router.delete('/sessions/:id', asyncHandler(sessionController.remove));

router.get('/posts', asyncHandler(postController.listAdmin));
router.delete('/posts/:id', asyncHandler(postController.deletePost));
router.get('/posts/:id/comments', asyncHandler(postController.getCommentsAdmin));
router.delete('/comments/:id', asyncHandler(postController.deleteComment));

module.exports = router;
