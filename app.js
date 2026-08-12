require('dotenv').config();

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');

const sessionMiddleware = require('./config/session');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth.routes');
const admissionRoutes = require('./routes/admission.routes');
const studentRoutes = require('./routes/students.routes');
const teacherRoutes = require('./routes/teachers.routes');
const noticeRoutes = require('./routes/notices.routes');
const postRoutes = require('./routes/posts.routes');
const feeRoutes = require('./routes/fees.routes');
const calendarRoutes = require('./routes/calendar.routes');
const sessionRoutes = require('./routes/sessions.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : true;

app.use(helmet());
app.use(cors({ origin: corsOrigins, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());
app.use(sessionMiddleware);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/admission', admissionRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res, next) => {
  next(createError(404, 'Route not found'));
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`School Management API running on http://localhost:${PORT}`);
});

module.exports = app;
