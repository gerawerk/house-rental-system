const express = require("express");
const multer = require("multer");

const authMiddlware = require("../middlewares/authMiddlware");

const {
  addPropertyController,
  getAllOwnerPropertiesController,
  deletePropertyController,
  updatePropertyController,
  getAllBookingsController,
  handleAllBookingstatusController,
  deleteBookingController,
  releasePropertyController,
} = require("../controllers/ownerController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const propertyUpload = upload.fields([
  { name: 'propertyImages', maxCount: 10 },
  { name: 'propertyDocuments', maxCount: 10 },
]);

router.post(
  "/postproperty",
  propertyUpload,
  authMiddlware,
  addPropertyController
);

router.get("/getallproperties", authMiddlware, getAllOwnerPropertiesController);

router.get("/getallbookings", authMiddlware, getAllBookingsController);

router.post("/handlebookingstatus", authMiddlware, handleAllBookingstatusController);
router.post("/deletebooking", authMiddlware, deleteBookingController);
router.post("/releaseproperty", authMiddlware, releasePropertyController);
router.delete(
  "/deleteproperty/:propertyid",
  authMiddlware,
  deletePropertyController
);

router.patch(
  "/updateproperty/:propertyid",
  upload.fields([
    { name: 'propertyImage', maxCount: 1 },
    { name: 'propertyDocuments', maxCount: 10 },
  ]),
  authMiddlware,
  updatePropertyController
);

module.exports = router;
