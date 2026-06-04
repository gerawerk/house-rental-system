import React, { useEffect, useState } from 'react';
import { Table, Spinner, Alert } from 'react-bootstrap';
import api from '../../services/api';

const SubscriptionFees = () => {
  const [fees, setFees] = useState([]);
  const [totalFee, setTotalFee] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const response = await api.get('/admin/subscriptionfees');
        if (response.data.success) {
          setFees(response.data.data || []);
          setTotalFee(response.data.totalFee || 0);
        } else {
          setError(response.data.message || 'Failed to load subscription fees');
        }
      } catch (err) {
        console.error(err);
        setError('Unable to fetch subscription fee records.');
      } finally {
        setLoading(false);
      }
    };
    fetchFees();
  }, []);

  return (
    <div>
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.title}>Subscription Fee Records</h2>
          <p style={styles.subtitle}>All 3% transaction fees collected from completed bookings.</p>
        </div>
        <div style={styles.totalCard}>
          <div style={styles.totalLabel}>Total Collected</div>
          <div style={styles.totalValue}>Br {totalFee?.toLocaleString()}</div>
        </div>
      </div>

      {loading ? (
        <div style={styles.loadingContainer}>
          <Spinner animation="border" variant="secondary" />
          <span style={styles.loadingText}>Loading subscription fees...</span>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : fees.length === 0 ? (
        <Alert variant="info">No paid transactions available yet.</Alert>
      ) : (
        <div style={styles.tableWrapper}>
          <Table responsive hover style={styles.table}>
            <thead style={styles.tableHead}>
              <tr>
                <th>#</th>
                <th>Booking ID</th>
                <th>Property ID</th>
                <th>Amount</th>
                <th>Fee (3%)</th>
                <th>Transaction</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((item, index) => (
                <tr key={item.bookingId + index}>
                  <td>{index + 1}</td>
                  <td style={styles.mono}>{item.bookingId}</td>
                  <td style={styles.mono}>{item.propertyId}</td>
                  <td>Br {item.amount?.toLocaleString()}</td>
                  <td>Br {item.fee?.toLocaleString()}</td>
                  <td style={styles.mono}>{item.transactionId}</td>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

const styles = {
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: 24,
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 28,
    margin: 0,
    color: 'var(--text-main)',
  },
  subtitle: {
    margin: '8px 0 0',
    color: 'var(--text-muted)',
  },
  totalCard: {
    background: 'var(--bg-secondary)',
    border: '1px solid #eaeaea',
    borderRadius: 16,
    padding: '18px 24px',
    minWidth: 230,
  },
  totalLabel: {
    color: '#7a7568',
    textTransform: 'uppercase',
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 6,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: 700,
    color: 'var(--text-main)',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    color: 'var(--text-main)',
  },
  loadingText: {
    color: 'var(--text-muted)',
  },
  tableWrapper: {
    background: 'var(--bg-secondary)',
    border: '1px solid #eaeaea',
    borderRadius: 16,
    padding: 16,
  },
  table: {
    marginBottom: 0,
  },
  tableHead: {
    background: 'var(--bg-primary)',
    color: 'var(--text-light)',
    textTransform: 'uppercase',
    fontSize: 12,
  },
  mono: {
    fontFamily: 'monospace',
    fontSize: 12,
    wordBreak: 'break-all',
  },
};

export default SubscriptionFees;
