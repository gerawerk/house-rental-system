import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Spin } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import api from '../../services/api';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, failed

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString.replace(/&amp;/g, '&'));
    const bookingId = urlParams.get('bookingId');
    const tx_ref = urlParams.get('tx_ref');

    if (!bookingId || !tx_ref) {
      setStatus('failed');
      message.error('Missing payment information');
      setTimeout(() => navigate('/renterhome?tab=bookings'), 4000);
      return;
    }

    const verify = async () => {
      try {
        const res = await api.get(`/payment/verify?tx_ref=${tx_ref}&bookingId=${bookingId}`);

        if (res.data.success) {
          setStatus('success');
        } else {
          setStatus('failed');
          message.error('Payment verification failed');
        }
      } catch (error) {
        console.error(error);
        setStatus('failed');
        message.error('Could not verify payment');
      } finally {
        setTimeout(() => navigate('/renterhome?tab=bookings'), 4000);
      }
    };
    verify();
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8f7f4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div style={{ textAlign: 'center', padding: '40px 20px', background: '#fff', borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', maxWidth: 500, margin: '20px' }}>
        {status === 'verifying' && (
          <>
            <Spin size="large" />
            <h3 style={{ marginTop: 24, color: '#1a1a2e' }}>Verifying your payment...</h3>
            <p style={{ color: '#7a7568', marginTop: 8 }}>Please wait while we confirm your transaction.</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircleOutlined style={{ fontSize: 80, color: '#28a745', marginBottom: 16 }} />
            <h2 style={{ color: '#1a1a2e', marginBottom: 8 }}>Payment Successful!</h2>
            <p style={{ color: '#7a7568' }}>Your booking is now confirmed.</p>
            <p style={{ color: '#7a7568', marginTop: 16 }}>Redirecting to your bookings...</p>
          </>
        )}
        {status === 'failed' && (
          <>
            <CloseCircleOutlined style={{ fontSize: 80, color: '#dc3545', marginBottom: 16 }} />
            <h2 style={{ color: '#1a1a2e', marginBottom: 8 }}>Payment Verification Failed</h2>
            <p style={{ color: '#7a7568' }}>Please try again or contact support.</p>
            <p style={{ color: '#7a7568', marginTop: 16 }}>Redirecting to your bookings...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;