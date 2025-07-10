const express = require('express');
const multer = require('multer');
const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // req.file.buffer contains the file data in memory (Buffer)
  // req.file.originalname is original file name

  // For now just send back the file name
  res.json({ fileName: req.file.originalname });
});

// Error handling middleware for multer errors
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

module.exports = router;
