const mongoose = require("mongoose");

const bookingModel = mongoose.Schema(
  {
    propertyId: {   
      type: mongoose.Schema.Types.ObjectId,
      ref: "propertyschema",
    },
    ownerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    userName: {
      type: String,
      required: [true, "Please provide a User Name"],
    },
    phone: {
      type: Number,
      required: [true, "Please provide a Phone Number"],
    },
    bookingStatus: {
      type: String,
      enum: ['pending', 'booked', 'cancelled'],
      default: 'pending',
      required: true,
    },
    paymentStatus: {          
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
      required: true,
    },
    paymentTransactionId: {    
      type: String,
      default: null,
    }
  },
  {
    strict: true,
    timestamps: true,           
  }
);

const bookingSchema = mongoose.model("bookingschema", bookingModel);
module.exports = bookingSchema;