const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const userSchema = require("../schemas/userModel");
const propertySchema = require("../schemas/propertyModel");
const bookingSchema = require("../schemas/bookingModel");

//////////for registering/////////////////////////////
const registerController = async (req, res) => {
  try {
    let granted = "";
    const existsUser = await userSchema.findOne({ email: req.body.email });
    if (existsUser) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;

    if (req.body.type === "Owner") {
      granted = "ungranted";
      const newUser = new userSchema({ ...req.body, granted });
      await newUser.save();
    } else {
      const newUser = new userSchema(req.body);
      await newUser.save();
    }

 
    return res.status(201).send({ message: "Register Success", success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: `${error.message}` });
  }
};

////for the login
const loginController = async (req, res) => {
  try {
    const user = await userSchema.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User not found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invalid email or password", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
      expiresIn: "1d",
    });
    user.password = undefined;
    return res.status(200).send({
      message: "Login success successfully",
      success: true,
      token,
      user: user,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: `${error.message}` });
  }
};

/////forgotting password
const forgotPasswordController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await userSchema.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(200)
        .send({ message: "User not found", success: false });
    }

    await updatedUser.save();
    return res.status(200).send({
      message: "Password changed successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: `${error.message}` });
  }
};

////auth controller
const authController = async (req, res) => {
  console.log(req.body);
  try {
    const user = await userSchema.findOne({ _id: req.body.userId });
    console.log(user);
    if (!user) {
      return res
        .status(200)
        .send({ message: "user not found", success: false });
    } else {
      return res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "auth error", success: false, error });
  }
};
/////////get all properties in home
const getAllPropertiesController = async (req, res) => {
  try {
    const allProperties = await propertySchema.find({});
    if (!allProperties) {
      throw new Error("No properties available");
    } else {
      res.status(200).send({ success: true, data: allProperties });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "auth error", success: false, error });
  }
};

const bookingHandleController = async (req, res) => {
  const { propertyid } = req.params;
  const { userDetails, status, ownerId } = req.body;
  
  // Get the logged-in user's ID from the auth token
  const userId = req.user.id || req.user._id;

  try {
    const booking = new bookingSchema({
      propertyId: propertyid,
      userID: userId,           
      ownerID: ownerId,
      userName: userDetails.fullName,
      phone: userDetails.phone,
      bookingStatus: status,
      paymentStatus: 'pending',  
    });

    await booking.save();
    return res.status(200).send({ success: true, message: "Booking status updated" });
  } catch (error) {
    console.error("Error handling booking:", error);
    return res.status(500).send({ success: false, message: "Error handling booking" });
  }
};
const getAllBookingsController = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const userObjectId = new mongoose.Types.ObjectId(userId.toString());

    // Find bookings by userID (now correctly populated)
    const bookings = await bookingSchema.find({ userID: userObjectId });
    if (bookings.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Get user email
    const user = await userSchema.findById(userObjectId).select('email');
    const userEmail = user?.email || '';

    // Collect property IDs from the bookings (support both field names)
    const propertyIds = bookings
      .map(b => b.propertyId || b.propertId)
      .filter(id => id)
      .map(id => new mongoose.Types.ObjectId(id.toString()));

    // Fetch the related properties (to get rent amount)
    const properties = await propertySchema.find({ _id: { $in: propertyIds } }).select('rentAmount price');
    const propertyMap = new Map();
    properties.forEach(p => propertyMap.set(p._id.toString(), p));

    // Enrich each booking with rentAmount and email
    const enrichedBookings = bookings.map(booking => {
      const obj = booking.toObject();
      const propId = obj.propertyId || obj.propertId;
      const property = propId ? propertyMap.get(propId.toString()) : null;
      obj.rentAmount = property?.rentAmount || property?.price || 0;
      obj.email = userEmail;
      return obj;
    });

    return res.status(200).json({ success: true, data: enrichedBookings });
  } catch (error) {
    console.error("Error in getAllBookingsController:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
module.exports = {
  registerController,
  loginController,
  forgotPasswordController,
  authController,
  getAllPropertiesController,
  bookingHandleController,
  getAllBookingsController,
};
