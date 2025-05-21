const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = path.join(__dirname, '../uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
  filename: (_, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowed = ['.jpg', '.jpeg', '.png'];
    if (!allowed.includes(ext)) {
      return cb(new Error('Only .jpg, .jpeg and .png files are allowed'));
    }
    cb(null, true);
  }
}).array('images', 10); // Accept up to 10 images

// ✅ Middleware wrapper
const uploadMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

module.exports = uploadMiddleware;
