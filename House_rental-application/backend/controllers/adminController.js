const propertySchema = require("../schemas/propertyModel");
const userSchema = require("../schemas/userModel");
const bookingSchema = require("../schemas/bookingModel");

/////////getting all users///////////////
const getAllUsersController = async (req, res) => {
  try {
    const allUsers = await userSchema.find({});
    if (!allUsers) {
      return res.status(401).send({
        success: false,
        message: "No users presents",
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "All users",
        data: allUsers,
      });
    }
  } catch (error) {
    console.log("Error in get All Users Controller ", error);
  }
};

/////////handling status for owner/////////
const handleStatusController = async (req, res) => {
  const { userid, status } = req.body;
  try {
    const user = await userSchema.findByIdAndUpdate(
      userid,
      { granted: status },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: `User has been ${status}`,
    });
  } catch (error) {
    console.log("Error in get All Users Controller ", error);
  }
};

/////////handling active/disable for any user/////////
const handleUserActiveController = async (req, res) => {
  const { userid, isActive } = req.body;
  try {
    await userSchema.findByIdAndUpdate(
      userid,
      { isActive: isActive },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: `User has been ${isActive ? 'activated' : 'disabled'}`,
    });
  } catch (error) {
    console.log("Error in handleUserActiveController ", error);
    return res.status(500).send({ success: false, message: "Internal server error" });
  }
};

/////////getting all properties in app//////////////
const getAllPropertiesController = async (req, res) => {
  try {
    const allProperties = await propertySchema.find({});
    if (!allProperties) {
      return res.status(401).send({
        success: false,
        message: "No properties presents",
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "All properties",
        data: allProperties,
      });
    }
  } catch (error) {
    console.log("Error in get All Properties Controller ", error);
  }
};

/////////admin update property//////////////
const updatePropertyController = async (req, res) => {
  const { propertyid } = req.params;
  try {
    const updatedProperty = await propertySchema.findByIdAndUpdate(
      propertyid,
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!updatedProperty) {
      return res.status(404).send({ success: false, message: "Property not found" });
    }
    return res.status(200).send({
      success: true,
      message: "Property updated successfully.",
    });
  } catch (error) {
    console.error("Error updating property:", error);
    return res.status(500).json({ success: false, message: "Failed to update property." });
  }
};

/////////admin hide/unhide property//////////////
const togglePropertyVisibilityController = async (req, res) => {
  const { propertyid, isAvailable } = req.body;
  try {
    await propertySchema.findByIdAndUpdate(
      propertyid,
      { isAvailable: isAvailable },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: `Property has been ${isAvailable === 'Available' ? 'unhidden' : 'hidden'}`,
    });
  } catch (error) {
    console.error("Error toggling property visibility:", error);
    return res.status(500).send({ success: false, message: "Internal server error" });
  }
};

/////////admin delete property//////////////
const deletePropertyController = async (req, res) => {
  const { propertyid } = req.params;
  try {
    await propertySchema.findByIdAndDelete(propertyid);
    return res.status(200).send({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting property:", error);
    return res.status(500).send({ success: false, message: "Internal server error" });
  }
};

////////get all bookings////////////
const getAllBookingsController = async (req, res) => {
  try {
    const allBookings = await bookingSchema.find()
      .populate('propertyId', 'propertyType propertyAddress propertyAmt propertyAdType')
      .populate('ownerID', 'name email')
      .populate('userID', 'name email');
    return res.status(200).send({
      success: true,
      data: allBookings,
    });
  } catch (error) {
    console.log("Error in get All Bookings Controller ", error);
  }
};

/////////admin update booking//////////////
const updateBookingController = async (req, res) => {
  const { bookingId, updates } = req.body;
  try {
    const updatedBooking = await bookingSchema.findByIdAndUpdate(
      bookingId,
      { ...updates },
      { new: true, runValidators: true }
    );
    if (!updatedBooking) {
      return res.status(404).send({ success: false, message: "Booking not found" });
    }

    // If booking status is changed to 'accepted', set property as unavailable
    if (updates.bookingStatus === 'accepted' && updatedBooking.propertyId) {
      await propertySchema.findByIdAndUpdate(
        updatedBooking.propertyId,
        { isAvailable: 'Unavailable' },
        { new: true }
      );
    }

    return res.status(200).send({
      success: true,
      message: "Booking updated successfully.",
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    return res.status(500).json({ success: false, message: "Failed to update booking." });
  }
};

/////////admin delete booking//////////////
const deleteBookingController = async (req, res) => {
  const { bookingId } = req.params;
  try {
    await bookingSchema.findByIdAndDelete(bookingId);
    return res.status(200).send({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return res.status(500).send({ success: false, message: "Internal server error" });
  }
};

/////////admin update booking status//////////////
const updateBookingStatusController = async (req, res) => {
  const { bookingId, bookingStatus } = req.body;
  try {
    const updatedBooking = await bookingSchema.findByIdAndUpdate(
      bookingId,
      { bookingStatus },
      { new: true }
    );
    if (!updatedBooking) {
      return res.status(404).send({ success: false, message: "Booking not found" });
    }

    // If booking status is changed to 'accepted', set property as unavailable
    if (bookingStatus === 'accepted' && updatedBooking.propertyId) {
      await propertySchema.findByIdAndUpdate(
        updatedBooking.propertyId,
        { isAvailable: 'Unavailable' },
        { new: true }
      );
    }

    return res.status(200).send({
      success: true,
      message: `Booking status changed to ${bookingStatus}`,
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    return res.status(500).send({ success: false, message: "Internal server error" });
  }
};

module.exports = {
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
};
