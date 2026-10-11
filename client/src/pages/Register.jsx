import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, ShoppingBag, Smartphone, KeyRound, ArrowLeft, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';

const MOBILE_REGEX = /^[6-9]\d{9}$/;
const RESEND_COOLDOWN = 30;

const Register = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const { sendRegisterOtp, verifyRegisterOtp } = useAuth();
  const navigate = useNavigate();
  const otpInputRef = useRef(null);

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Auto-focus OTP input on step 2
  useEffect(() => {
    if (step === 2 && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [step]);

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (!MOBILE_REGEX.test(mobile)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    const result = await sendRegisterOtp(name.trim(), mobile);
    setLoading(false);

    if (result.success) {
      setStep(2);
      setCountdown(RESEND_COOLDOWN);
      setSuccess('OTP sent to your mobile number');
      setOtp('');
    } else {
      setError(result.message);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    setLoading(true);
    const result = await verifyRegisterOtp(mobile, otp);
    setLoading(false);

    if (result.success) {
      navigate('/', { replace: true });
    } else {
      setError(result.message);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setError(null);
    setSuccess(null);
    setLoading(true);
    const result = await sendRegisterOtp(name.trim(), mobile);
    setLoading(false);

    if (result.success) {
      setCountdown(RESEND_COOLDOWN);
      setSuccess('OTP resent successfully');
      setOtp('');
    } else {
      setError(result.message);
    }
  };

  const handleChangeNumber = () => {
    setStep(1);
    setOtp('');
    setError(null);
    setSuccess(null);
    setCountdown(0);
  };

  return (
    <div className="container">
      <div className="auth-wrapper">
        <div className="auth-header">
          <div
            className="nav-brand-icon"
            style={{ margin: '0 auto 1rem', width: '48px', height: '48px' }}
          >
            <ShoppingBag size={24} />
          </div>
          <h2>Create an Account</h2>
          <p>Join ShopEase today for personalized shopping and express checkout.</p>
        </div>

        {error && <ErrorMessage message={error} type="danger" />}
        {success && (
          <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
            {success}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <div className="form-group">
              <label className="form-label" htmlFor="register-name">
                Full Name
              </label>
              <input
                id="register-name"
                type="text"
                className="form-input"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-mobile">
                <Smartphone size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                Mobile Number
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.95rem',
                }}>
                  +91
                </span>
                <input
                  id="register-mobile"
                  type="tel"
                  className="form-input"
                  style={{ paddingLeft: '52px' }}
                  placeholder="Enter 10-digit mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  maxLength={10}
                  required
                  autoComplete="tel"
                />
              </div>
              <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
                We'll send you a 6-digit OTP to verify
              </small>
            </div>

            <button
              type="submit"
              disabled={loading || !name.trim() || mobile.length !== 10}
              className="btn btn-primary btn-block btn-lg"
              style={{ marginTop: '1.5rem' }}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
                  Sending OTP...
                </>
              ) : (
                <>
                  <Smartphone size={18} />
                  Send OTP
                </>
              )}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <div style={{
              padding: '0.75rem 1rem', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem', fontSize: '0.88rem', color: 'var(--primary-hover)',
            }}>
              <Smartphone size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              OTP sent to <strong>+91 {mobile}</strong>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-otp">
                <KeyRound size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                Enter OTP
              </label>
              <input
                ref={otpInputRef}
                id="register-otp"
                type="text"
                className="form-input"
                style={{ fontSize: '1.3rem', letterSpacing: '0.5rem', textAlign: 'center', fontWeight: 700 }}
                placeholder="••••••"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                required
                autoComplete="one-time-code"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="btn btn-primary btn-block btn-lg"
              style={{ marginTop: '1rem' }}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
                  Verifying...
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  Verify & Register
                </>
              )}
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={handleChangeNumber}
                className="btn btn-secondary btn-sm"
                style={{ gap: '0.3rem' }}
              >
                <ArrowLeft size={14} />
                Change Number
              </button>

              <button
                type="button"
                onClick={handleResend}
                disabled={countdown > 0 || loading}
                className="btn btn-secondary btn-sm"
                style={{ gap: '0.3rem' }}
              >
                <RefreshCw size={14} />
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
              </button>
            </div>
          </form>
        )}

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
