const express = require("express");
const multer = require("multer");
const path = require("path");
const authMiddleware = require("../middlewares/authMiddlware");

const {
  registerController,
  loginController,
  forgotPasswordController,
  authController,
  getAllPropertiesController,
  bookingHandleController,
  getAllBookingsController,
} = require("../controllers/userController");

const router = express.Router();

// Configure storage for government ID files (similar to owner but with unique names)
const govIdStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/government-ids/");  
  },
  filename: function (req, file, cb) {
    // Generate unique filename: timestamp + random number + original extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "govid-" + uniqueSuffix + ext);
  },
});

// Optional: file filter for images and PDFs
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only images and PDFs are allowed"), false);
  }
};

const uploadGovId = multer({
  storage: govIdStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter,
});

// Routes
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/forgotpassword", forgotPasswordController);
router.get('/getAllProperties', getAllPropertiesController);
router.post("/getuserdata", authMiddleware, authController);
router.post(
  "/bookinghandle/:propertyId",
  authMiddleware,
  uploadGovId.single("governmentId"),
  bookingHandleController
);

router.get('/getallbookings', authMiddleware, getAllBookingsController);

module.exports = router;