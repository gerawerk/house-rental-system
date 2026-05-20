const express = require('express');
const { initializePayment, verifyPayment, webhookHandler } = require('../controllers/paymentController');
const  authMiddleware  = require("../middlewares/authMiddlware");

const router = express.Router();

router.post('/initiate', authMiddleware, initializePayment);
router.get('/verify',verifyPayment); 
router.post('/webhook', webhookHandler); 

module.exports = router;