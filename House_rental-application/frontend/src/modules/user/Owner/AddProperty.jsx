import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd';
import api from '../../../services/api';

const AddProperty = () => {
  const [image, setImage] = useState(null);
  const [fileNames, setFileNames] = useState('');
  const [propertyDetails, setPropertyDetails] = useState({
    propertyType: 'residential',
    propertyAdType: 'rent',
    propertyAddress: '',
    ownerContact: '',
    propertyAmt: '',
    additionalInfo: '',
  });

  // Reset form function
  const resetForm = () => {
    setImage(null);
    setFileNames('');
    setPropertyDetails({
      propertyType: 'residential',
      propertyAdType: 'rent',
      propertyAddress: '',
      ownerContact: '',
      propertyAmt: '',
      additionalInfo: '',
    });
    // Clear file input (optional)
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    setImage(files);
    setFileNames(
      files.length > 1
        ? `${files.length} images selected`
        : files[0]?.name ?? ''
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPropertyDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(propertyDetails).forEach(([k, v]) => formData.append(k, v));
    if (image) {
      for (let i = 0; i < image.length; i++) {
        formData.append('propertyImages', image[i]);
      }
    }
    api.post('/owner/postproperty', formData, {
       headers: { 'Content-Type': 'multipart/form-data' }, 
       }).then((res) => {
        if (res.data.success) {
          message.success(res.data.message);
          resetForm(); // Clear form on success
        } else {
          message.error(res.data.message);
        }
      })
      .catch(() => message.error('Something went wrong. Please try again.'));
  };

  /* ── Shared input style ── */
  const inputStyle = {
    width: '100%',
    height: 42,
    padding: '0 12px',
    border: '1px solid #e8e4dc',
    borderRadius: 8,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    background: '#f8f7f4',
    color: '#1a1a2e',
    outline: 'none',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 11,
    fontWeight: 500,
    color: '#7a7568',
    marginBottom: 6,
    letterSpacing: '0.6px',
    textTransform: 'uppercase',
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* ── Hero banner ── */}
      <div style={styles.hero}>
        <div style={styles.heroBubble1} />
        <div style={styles.heroBubble2} />
        <div>
          <p style={styles.heroEyebrow}>Property Management</p>
          <h1 style={styles.heroTitle}>
            List your property<br />with ease
          </h1>
          <p style={styles.heroSub}>
            Fill in the details below to post your property for rent or sale.
            Reach thousands of potential tenants and buyers.
          </p>
        </div>
        <div style={styles.heroIcon}>
          <i className="ti ti-home-plus" style={{ fontSize: 36, color: '#c9a84c' }} />
        </div>
      </div>

      {/* ── Form card ── */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>
          <i className="ti ti-forms" style={{ color: '#c9a84c', fontSize: 18, marginRight: 8 }} />
          Property Details
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Row 1 */}
          <div style={styles.grid3}>
            <div>
              <label style={labelStyle}>Property Type</label>
              <select
                name="propertyType"
                value={propertyDetails.propertyType}
                onChange={handleChange}
                style={{ ...inputStyle, appearance: 'none' }}
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="land/plot">Land / Plot</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Listing Type</label>
              <select
                name="propertyAdType"
                value={propertyDetails.propertyAdType}
                onChange={handleChange}
                style={{ ...inputStyle, appearance: 'none' }}
              >
                <option value="rent">For Rent</option>
                <option value="sale">For Sale</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Full Address</label>
              <input
                type="text"
                name="propertyAddress"
                placeholder="e.g. 12 Maple Street, Lagos"
                value={propertyDetails.propertyAddress}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
          </div>

          {/* Row 2 */}
          <div style={{ ...styles.grid3, gridTemplateColumns: '2fr 1fr 1fr', marginTop: '1.25rem' }}>
            {/* Image upload */}
            <div>
              <label style={labelStyle}>Property Images</label>
              <label style={styles.uploadZone}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  required
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                <i className="ti ti-photo-up" style={{ fontSize: 22, color: '#7a7568', display: 'block', marginBottom: 4 }} />
                <span style={{ fontSize: 12, color: '#7a7568' }}>
                  {fileNames || 'Click to upload images'}
                </span>
              </label>
            </div>

            <div>
              <label style={labelStyle}>Contact Number</label>
              <input
                type="tel"
                name="ownerContact"
                placeholder="0957874554"
                value={propertyDetails.ownerContact}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Amount (birr)</label>
              <input
                type="number"
                name="propertyAmt"
                placeholder="0.00"
                value={propertyDetails.propertyAmt}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
          </div>

          {/* Row 3 */}
          <div style={{ marginTop: '1.25rem' }}>
            <label style={labelStyle}>Additional Details</label>
            <textarea
              name="additionalInfo"
              rows={4}
              placeholder="Describe amenities, rules, nearby facilities..."
              value={propertyDetails.additionalInfo}
              onChange={handleChange}
              style={{
                ...inputStyle,
                height: 'auto',
                padding: '10px 12px',
                resize: 'vertical',
                lineHeight: 1.6,
              }}
            />
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.75rem' }}>
            <button type="submit" style={styles.submitBtn}>
              <i className="ti ti-send" style={{ fontSize: 15 }} /> Post Property
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  hero: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d5e 100%)',
    borderRadius: 16,
    padding: '2.5rem',
    marginBottom: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
  },
  heroBubble1: {
    position: 'absolute', right: -20, top: -20,
    width: 200, height: 200, borderRadius: '50%',
    background: 'rgba(201,168,76,0.08)',
  },
  heroBubble2: {
    position: 'absolute', right: 60, bottom: -40,
    width: 140, height: 140, borderRadius: '50%',
    background: 'rgba(201,168,76,0.05)',
  },
  heroEyebrow: {
    color: '#c9a84c', fontSize: 11, fontWeight: 500,
    letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 8,
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    color: '#fff', fontSize: 28, fontWeight: 600,
    lineHeight: 1.3, marginBottom: 12,
  },
  heroSub: { color: '#a0a0c0', fontSize: 14, maxWidth: 380, lineHeight: 1.6 },
  heroIcon: {
    flexShrink: 0,
    width: 80, height: 80,
    background: 'rgba(201,168,76,0.15)',
    borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: '1.5px solid rgba(201,168,76,0.4)',
  },
  card: {
    background: '#fff',
    border: '1px solid #e8e4dc',
    borderRadius: 12,
    padding: '2rem',
  },
  cardTitle: {
    fontSize: 16, fontWeight: 500, marginBottom: '1.5rem',
    display: 'flex', alignItems: 'center',
  },
  grid3: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '1.25rem',
  },
  uploadZone: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    border: '1.5px dashed #e8e4dc',
    borderRadius: 8, padding: 16,
    background: '#f8f7f4',
    cursor: 'pointer', textAlign: 'center', height: 42 * 2,
  },
  submitBtn: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: '#1a1a2e', color: '#fff',
    border: 'none',
    padding: '12px 28px',
    borderRadius: 10,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14, fontWeight: 500,
    cursor: 'pointer', letterSpacing: '0.3px',
  },
};

export default AddProperty;