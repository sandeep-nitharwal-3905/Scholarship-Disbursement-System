import React, { useState } from 'react';
import './EKYC.css';

const EKYC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [kycKey, setKycKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');

  const handleGenerateOTP = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('http://localhost:5000/generate-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate OTP');
      }

      setSuccessMessage('OTP sent successfully to your email');
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('http://localhost:5000/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify OTP');
      }

      setKycKey(data.kycKey);
      setSuccessMessage('OTP verified successfully');
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ekyc-container">
    
      <div className="ekyc-card">
        <h2 className="ekyc-title">
          {step === 1 && 'eKYC Verification'}
          {step === 2 && 'Enter OTP'}
          {step === 3 && 'Verification Complete'}
        </h2>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        {step === 1 && (
          <div className="form-group">
            <input
              type="email"
              placeholder="Enter your email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <button
              className="submit-button"
              onClick={handleGenerateOTP}
              disabled={!email || loading}
            >
              {loading ? 'Sending OTP...' : 'Get OTP'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter OTP"
              className="input-field"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              disabled={loading}
            />
            <button
              className="submit-button"
              onClick={handleVerifyOTP}
              disabled={otp.length !== 6 || loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="form-group">
            <input
              type="text"
              value={kycKey}
              className="input-field"
              readOnly
            />
            <p className="info-text">
              Please save your KYC key for future reference. You will need this to access the portal.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EKYC;