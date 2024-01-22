const multer = require("multer");
exports.uploadMiddleware = multer({ dest: "uploads/" });
