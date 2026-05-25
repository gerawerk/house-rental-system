const express = require("express");
const authMiddlware = require("../middlewares/authMiddlware");
const {
  getAllUsersController,
  handleStatusController,
  handleUserActiveController,
  getAllPropertiesController,
  updatePropertyController,
  togglePropertyVisibilityController,
  deletePropertyController,
  getAllBookingsController,
  updateBookingController,
  deleteBookingController,
  updateBookingStatusController,
} = require("../controllers/adminController");

const router = express.Router()

router.get('/getallusers', authMiddlware, getAllUsersController)

router.post('/handlestatus', authMiddlware, handleStatusController)

router.post('/handleuseractive', authMiddlware, handleUserActiveController)

router.get('/getallproperties', authMiddlware, getAllPropertiesController)

router.patch('/updateproperty/:propertyid', authMiddlware, updatePropertyController)

router.post('/togglepropertyvisibility', authMiddlware, togglePropertyVisibilityController)

router.delete('/deleteproperty/:propertyid', authMiddlware, deletePropertyController)

router.get('/getallbookings', authMiddlware, getAllBookingsController)

router.post('/updatebooking', authMiddlware, updateBookingController)

router.delete('/deletebooking/:bookingId', authMiddlware, deleteBookingController)

router.post('/updatebookingstatus', authMiddlware, updateBookingStatusController)

module.exports = router