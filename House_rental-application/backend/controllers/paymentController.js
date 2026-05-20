const { Chapa } = require('chapa-nodejs');
const axios = require('axios');
const bookingSchema = require('../schemas/bookingModel');
const propertySchema = require('../schemas/propertyModel');
const userSchema = require('../schemas/userModel');

const getChapaInstance = () => {
  if (!process.env.CHAPA_SECRET_KEY) {
    throw new Error("CRITICAL: CHAPA_SECRET_KEY is missing from environment variables.");
  }
  return new Chapa({ secretKey: process.env.CHAPA_SECRET_KEY });
};


const initializePayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    // Fetch booking
    const booking = await bookingSchema.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Fetch property to get amount
    const propertyId = booking.propertyId || booking.propertId;
    if (!propertyId) {
      return res.status(400).json({ success: false, message: 'Booking has no property reference' });
    }
    const property = await propertySchema.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    let amount = property.rentAmount || property.price || property.propertyAmt;
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid property amount' });
    }
    const amountStr = amount.toString();

    // Fetch user (tenant) to get email and name
    const user = await userSchema.findById(booking.userID);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const email = user.email;
    const fullName = user.name || booking.userName;
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || 'User';

    // Clean and validate phone number (from booking)
    let phoneNumber = booking.phone ? booking.phone.toString().trim() : '';
    if (phoneNumber.length === 9 && (phoneNumber.startsWith('9') || phoneNumber.startsWith('7'))) {
      phoneNumber = '0' + phoneNumber;
    }
    if (!phoneNumber.match(/^0[79]\d{8}$/)) {
      phoneNumber = '0911222333'; 
    }

    // Generate transaction reference
    const tx_ref = `TX-${Date.now()}-${bookingId.slice(-6)}`;
    const cleanFrontendUrl = process.env.FRONTEND_URL.replace(/['"]+/g, '');

    // Build Chapa payload (direct axios call)
    const chapaPayload = {
      amount: amountStr,
      currency: 'ETB',
      email: email,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      tx_ref: tx_ref,
      // callback_url: `${cleanFrontendUrl}/payment/verify?bookingId=${bookingId}&tx_ref=${tx_ref}`,
      return_url: `${cleanFrontendUrl}/payment/success?bookingId=${bookingId}&tx_ref=${tx_ref}`,     
       customization: {
        title: 'Rent Payment',
        description: `Booking ${bookingId.slice(-8)}`,
      },
    };


    const response = await axios.post(
      'https://api.chapa.co/v1/transaction/initialize',
      chapaPayload,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data && response.data.status === 'success') {
      await bookingSchema.findByIdAndUpdate(bookingId, { paymentTransactionId: tx_ref });
      return res.status(200).json({
        success: true,
        checkout_url: response.data.data.checkout_url,
      });
    } else {
      return res.status(400).json({ success: false, message: 'Payment initialization failed' });
    }
  } catch (error) {
    console.error('\n🔥 Payment init error:');
    if (error.response && error.response.data) {
    } else {
      console.error(error.message);
    }
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const verifyPayment = async (req, res) => {
  const { tx_ref, bookingId } = req.query;


  try {
    const chapa = getChapaInstance();
    
    const verification = await chapa.verify({ tx_ref });
    // Check the response structure
    if (!verification) {
      return res.status(400).json({ success: false, message: 'No response from payment gateway' });
    }

    const isSuccess = verification.status === 'success' && verification.data?.status === 'success';
   
    if (isSuccess) {
      const updated = await bookingSchema.findByIdAndUpdate(
        bookingId,
        { paymentStatus: 'paid' },
        { new: true }
      );
      return res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } else {
      return res.status(400).json({ success: false, message: 'Payment not successful' });
    }
  } catch (error) {
    if (error.response) {
      console.error('Chapa API error response:', error.response.data);
    }
    if (error.request) {
      console.error('No response received from Chapa');
    }
    return res.status(500).json({ success: false, message: 'Verification failed' });
  }
};

const webhookHandler = async (req, res) => {
  const { tx_ref, status } = req.body;
  try {
    if (status === 'success') {
      const booking = await bookingSchema.findOne({ paymentTransactionId: tx_ref });
      if (booking && booking.paymentStatus !== 'paid') {
        booking.paymentStatus = 'paid';
        await booking.save();
        console.log(`Webhook: Payment confirmed for booking ${booking._id}`);
      }
    }
  } catch (err) {
    console.error('Webhook processing failure:', err);
  }
  res.status(200).send('Webhook received');
};

module.exports = { initializePayment, verifyPayment, webhookHandler };