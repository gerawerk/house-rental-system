const bookingSchema = require("../schemas/bookingModel");
const propertySchema = require("../schemas/propertyModel");
const userSchema = require("../schemas/userModel");

// Add property by owner (authenticated)
const addPropertyController = async (req, res) => {
  try {
    // Get owner ID from authenticated user
    const ownerId = req.user.id || req.user._id;
    if (!ownerId) {
      return res.status(401).send({ success: false, message: "Unauthorized" });
    }

    // Fetch owner details
    const user = await userSchema.findById(ownerId);
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    let images = [];
    if (req.files) {
      images = req.files.map((file) => ({
        filename: file.filename,
        path: `/uploads/${file.filename}`,
      }));
    }

    const newPropertyData = new propertySchema({
      ...req.body,
      propertyImage: images,
      ownerId: user._id,
      ownerName: user.name,
      isAvailable: "Available",
    });

    await newPropertyData.save();

    return res.status(200).send({
      success: true,
      message: "New Property has been stored",
    });
  } catch (error) {
    console.log("Error in addPropertyController: ", error);
    return res.status(500).send({ success: false, message: "Internal server error" });
  }
};
const getAllOwnerPropertiesController = async (req, res) => {
  try {
    const ownerId = req.user.id || req.user._id;
    if (!ownerId) return res.status(401).json({ success: false, message: "Unauthorized" });

    // Fetch properties belonging to this owner
    const ownerProperties = await propertySchema.find({ ownerId: ownerId });

    if (ownerProperties.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }
    // Extract all property IDs into an array
    const propertyIds = ownerProperties.map(p => p._id);
    // Find ALL paid bookings for these properties in ONE single database query
    const paidBookings = await bookingSchema.find({
      propertyId: { $in: propertyIds },
      paymentStatus: 'paid'
    }).select('propertyId paymentStatus');

    if (paidBookings.length > 0) {
      paidBookings.forEach((b, i) => {
      });
    }
    // Create a Set of property IDs that have a paid booking for instant lookup
    const paidPropertyIdsSet = new Set(
      paidBookings.map(b => b.propertyId.toString())
    );

    // Map the flag onto your properties
    const propertiesWithFlag = ownerProperties.map((property, index) => {
      const propIdStr = property._id.toString();
      const hasPaid = paidPropertyIdsSet.has(propIdStr);      
      return {
        ...property.toObject(),
        hasPaidBooking: hasPaid
      };
    });

    return res.status(200).json({ success: true, data: propertiesWithFlag });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
// Delete property by owner
const deletePropertyController = async (req, res) => {
  const propertyId = req.params.propertyid;
  try {
    await propertySchema.findByIdAndDelete(propertyId);
    return res.status(200).send({
      success: true,
      message: "The property is deleted",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error", success: false });
  }
};

// Update property by owner
const updatePropertyController = async (req, res) => {
  const { propertyid } = req.params;
  try {
    const ownerId = req.user.id || req.user._id;
    const property = await propertySchema.findById(propertyid);
    if (!property) {
      return res.status(404).send({ success: false, message: "Property not found" });
    }
    if (property.ownerId.toString() !== ownerId.toString()) {
      return res.status(403).send({ success: false, message: "Not authorized to update this property" });
    }

    const updatedProperty = await propertySchema.findByIdAndUpdate(
      { _id: propertyid },
      { ...req.body },
      { new: true, runValidators: true }
    );

    return res.status(200).send({
      success: true,
      message: "Property updated successfully.",
    });
  } catch (error) {
    console.error("Error updating property:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update property.",
    });
  }
};

// Get all bookings for the owner's properties (already correct)
const getAllBookingsController = async (req, res) => {
  try {
    const ownerId = req.user.id || req.user._id;
    if (!ownerId) {
      return res.status(401).send({ success: false, message: "Unauthorized: No owner ID found" });
    }

    const allBookings = await bookingSchema.find();
    const ownerBookings = allBookings.filter(
      (booking) => booking.ownerID.toString() === ownerId.toString()
    );

    return res.status(200).send({
      success: true,
      data: ownerBookings,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: "Internal server error" });
  }
};

// Delete a booking (owner cancel)
const deleteBookingController = async (req, res) => {
  const { bookingId } = req.body;
  try {
    await bookingSchema.findByIdAndDelete(bookingId);
    return res.status(200).send({
      success: true,
      message: "Booking cancelled and deleted",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error", success: false });
  }
};
const handleAllBookingstatusController = async (req, res) => {
  const { bookingId, propertyId, status } = req.body;
  try {
    const ownerId = req.user.id || req.user._id;
    const booking = await bookingSchema.findById(bookingId);
    if (!booking) {
      return res.status(404).send({ success: false, message: "Booking not found" });
    }
    if (booking.ownerID.toString() !== ownerId.toString()) {
      return res.status(403).send({ success: false, message: "Not authorized" });
    }

    // Update booking status
    const updatedBooking = await bookingSchema.findByIdAndUpdate(
      bookingId,
      { bookingStatus: status },
      { new: true }
    );

    // If the status is 'accepted', set the property as unavailable
    if (status === 'accepted') {
      await propertySchema.findByIdAndUpdate(
        propertyId,
        { isAvailable: 'Unavailable' },
        { new: true }
      );
    }

    return res.status(200).send({
      success: true,
      message: `Booking status changed to ${status}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error", success: false });
  }
};
module.exports = {
  addPropertyController,
  getAllOwnerPropertiesController,
  deletePropertyController,
  updatePropertyController,
  getAllBookingsController,
  handleAllBookingstatusController,
  deleteBookingController,
};