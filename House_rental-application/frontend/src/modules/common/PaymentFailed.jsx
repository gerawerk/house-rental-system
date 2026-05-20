import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { message } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';

const PaymentFailed = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  useEffect(() => {
    message.error('Payment failed. Please try again.');
    const timer = setTimeout(() => {
      navigate(`/renterhome?tab=bookings${bookingId ? `&bookingId=${bookingId}` : ''}`);
    }, 4000);
    return () => clearTimeout(timer);
  }, [navigate, bookingId]);

  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f8f7f4', minHeight: '100vh' }}>
      <CloseCircleOutlined style={{ fontSize: 80, color: '#dc3545', marginBottom: 24 }} />
      <h1>Payment Failed</h1>
      <p>Your payment was not completed. You will be redirected to your bookings shortly...</p>
    </div>
  );
};

export default PaymentFailed;