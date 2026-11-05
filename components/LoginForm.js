'use client';
import { useState, useTransition } from 'react';
import Link from 'next/link';
import BackButton from '@/components/BackButton';
import { login, requestPasswordChangeOTP, verifyPasswordChangeOTP } from '@/app/hidden-admin/actions';

export default function LoginForm({ k = '', title = 'Staff & Admin Console' }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'otp'
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoginPending, startLoginTransition] = useTransition();

  // OTP State
  const [otpStep, setOtpStep] = useState(1); // 1 = request, 2 = verify
  const [deliveryMethod, setDeliveryMethod] = useState('email'); // 'email' | 'sms'
  const [identity, setIdentity] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [targetKey, setTargetKey] = useState('');
  const [otpStatus, setOtpStatus] = useState(null); // { type: 'success' | 'error', text: '' }
  const [devOtpHint, setDevOtpHint] = useState('');
  const [isOtpPending, startOtpTransition] = useTransition();

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    const fd = new FormData(e.currentTarget);
    startLoginTransition(async () => {
      try {
        const res = await login(fd);
        if (res && res.error) {
          setLoginError(res.error);
        } else if (res && res.ok) {
          window.location.href = '/staff-portal';
        }
      } catch (err) {
        setLoginError(err?.message || 'Authentication error. Please try again.');
      }
    });
  };

  const handleRequestOTP = (e) => {
    e.preventDefault();
    setOtpStatus(null);
    setDevOtpHint('');
    const fd = new FormData(e.currentTarget);
    const idVal = String(fd.get('identity') || '').trim();
    const pwVal = String(fd.get('new_password') || '').trim();
    setIdentity(idVal);
    setNewPassword(pwVal);

    startOtpTransition(async () => {
      try {
        const res = await requestPasswordChangeOTP(fd);
        if (res?.ok) {
          setTargetKey(res.targetKey || idVal);
          setOtpStep(2);
          setOtpStatus({
            type: 'success',
            text: res.message || 'OTP verification code successfully dispatched.'
          });
          if (res?.otp) {
            setDevOtpHint(res.otp);
          }
        } else {
          setOtpStatus({
            type: 'error',
            text: res?.error || 'Unable to dispatch OTP. Please verify your registered details.'
          });
        }
      } catch (err) {
        setOtpStatus({
          type: 'error',
          text: err?.message || 'Error communicating with security desk.'
        });
      }
    });
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    setOtpStatus(null);
    const fd = new FormData();
    fd.append('target_key', targetKey);
    fd.append('otp', otpCode);
    fd.append('new_password', newPassword);

    startOtpTransition(async () => {
      try {
        const res = await verifyPasswordChangeOTP(fd);
        if (res?.ok) {
          setOtpStatus({
            type: 'success',
            text: res.message || 'Password updated successfully! You may now sign in.'
          });
          setOtpStep(1);
          setOtpCode('');
          setNewPassword('');
          setDevOtpHint('');
          setTimeout(() => {
            setActiveTab('login');
          }, 2000);
        } else {
          setOtpStatus({
            type: 'error',
            text: res?.error || 'Verification failed. Please check the code.'
          });
        }
      } catch (err) {
        setOtpStatus({
          type: 'error',
          text: err?.message || 'Verification process encountered an issue.'
        });
      }
    });
  };

  return (
    <main className="subpage-body" style={{ background: '#f8fafc', minHeight: '85vh', padding: '30px 0 60px' }}>
      <div className="wrapper">
        <BackButton fallback="/" label="Back to Website" current="Staff & Admin Portal Login" />

        <div style={{
          maxWidth: '520px',
          margin: '25px auto 40px',
          background: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 15px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          {/* TOP CREST & BRAND HEADER */}
          <div style={{
            background: 'linear-gradient(135deg, #1E232A 0%, #2A313C 100%)',
            padding: '28px 24px 22px',
            textAlign: 'center',
            borderBottom: '3px solid #8B1E2D',
            position: 'relative'
          }}>
            <div style={{
              width: '74px',
              height: '74px',
              margin: '0 auto 12px',
              background: '#ffffff',
              borderRadius: '50%',
              padding: '6px',
              boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src="/images/pvs_crest.png?v=20261105"
                alt="Pleasant View Schools Crest"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <h1 style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '20px',
              letterSpacing: '1px',
              color: '#ffffff',
              margin: '0 0 4px',
              fontWeight: 800
            }}>
              PLEASANT VIEW SCHOOLS
            </h1>
            <p style={{
              color: 'rgba(255,255,255,0.75)',
              fontSize: '12.5px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              margin: 0,
              fontWeight: 600
            }}>
              {title}
            </p>
          </div>

          {/* DUAL MODE TAB SELECTOR */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #e2e8f0',
            background: '#f1f5f9'
          }}>
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setLoginError(''); }}
              style={{
                flex: 1,
                padding: '14px 10px',
                border: 'none',
                background: activeTab === 'login' ? '#ffffff' : 'transparent',
                color: activeTab === 'login' ? '#8B1E2D' : '#64748b',
                fontWeight: 700,
                fontSize: '13.5px',
                cursor: 'pointer',
                borderBottom: activeTab === 'login' ? '3px solid #8B1E2D' : '3px solid transparent',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <i className="fa-solid fa-lock" /> Sign In
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('otp'); setOtpStatus(null); }}
              style={{
                flex: 1,
                padding: '14px 10px',
                border: 'none',
                background: activeTab === 'otp' ? '#ffffff' : 'transparent',
                color: activeTab === 'otp' ? '#8B1E2D' : '#64748b',
                fontWeight: 700,
                fontSize: '13.5px',
                cursor: 'pointer',
                borderBottom: activeTab === 'otp' ? '3px solid #8B1E2D' : '3px solid transparent',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <i className="fa-solid fa-key" /> Reset Password (OTP)
            </button>
          </div>

          {/* TAB 1: DIRECT SIGN IN */}
          {activeTab === 'login' && (
            <div style={{ padding: '26px 28px 30px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '18px',
                color: '#64748b',
                fontSize: '13px'
              }}>
                <i className="fa-solid fa-shield-halved" style={{ color: '#8B1E2D' }} />
                <span>Enter your registered administrative credentials to access the console.</span>
              </div>

              {loginError && (
                <div style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#991b1b',
                  padding: '12px 14px',
                  borderRadius: '6px',
                  fontSize: '13.5px',
                  lineHeight: 1.5,
                  marginBottom: '18px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}>
                  <i className="fa-solid fa-triangle-exclamation" style={{ marginTop: '2px' }} />
                  <div>{loginError}</div>
                </div>
              )}

              <form onSubmit={handleLoginSubmit}>
                <input type="hidden" name="key" value={k} />

                <div className="form-group" style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                    Admin Username or Department Email
                  </label>
                  <div style={{ position: 'relative' }}>
                    <i className="fa-solid fa-user-shield" style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#94a3b8',
                      fontSize: '14px'
                    }} />
                    <input
                      name="email"
                      type="text"
                      placeholder="e.g. admin or senior@pleasantviewschools.co.ke"
                      autoComplete="username"
                      required
                      style={{
                        width: '100%',
                        padding: '11px 12px 11px 36px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '14px',
                        color: '#1e293b',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#64748b',
                        fontSize: '12px',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} /> {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <i className="fa-solid fa-key" style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#94a3b8',
                      fontSize: '14px'
                    }} />
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter administrator password"
                      autoComplete="current-password"
                      required
                      style={{
                        width: '100%',
                        padding: '11px 12px 11px 36px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '14px',
                        color: '#1e293b',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoginPending}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #8B1E2D 0%, #6D1421 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '13px',
                    borderRadius: '6px',
                    fontSize: '14.5px',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                    cursor: isLoginPending ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(139,30,45,0.3)',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <i className="fa-solid fa-arrow-right-to-bracket" />
                  {isLoginPending ? 'Verifying Credentials...' : 'Sign In to Console'}
                </button>
              </form>

              <div style={{
                marginTop: '20px',
                textAlign: 'center',
                paddingTop: '16px',
                borderTop: '1px solid #f1f5f9'
              }}>
                <button
                  type="button"
                  onClick={() => { setActiveTab('otp'); setOtpStatus(null); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#8B1E2D',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Forgot or need to change your password? Reset via OTP
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: OTP PASSWORD CHANGE (RESTRICTED TO SAVED PORTAL EMAILS & PHONES) */}
          {activeTab === 'otp' && (
            <div style={{ padding: '24px 28px 30px' }}>
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                padding: '12px 14px',
                borderRadius: '6px',
                fontSize: '12.5px',
                color: '#475569',
                lineHeight: 1.5,
                marginBottom: '18px'
              }}>
                <i className="fa-solid fa-lock-open" style={{ color: '#8B1E2D', marginRight: '6px' }} />
                <strong>Institutional Security Protocol:</strong> One-Time Passwords (OTP) are dispatched exclusively to verified emails and phone numbers already registered in the Pleasant View portal. Passwords updated here are encrypted and decoupled from source code.
              </div>

              {otpStatus && (
                <div style={{
                  background: otpStatus.type === 'success' ? '#f0fdf4' : '#fef2f2',
                  border: `1px solid ${otpStatus.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
                  color: otpStatus.type === 'success' ? '#166534' : '#991b1b',
                  padding: '12px 14px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  lineHeight: 1.5,
                  marginBottom: '18px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <i className={`fa-solid ${otpStatus.type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'}`} style={{ marginTop: '2px' }} />
                  <div>{otpStatus.text}</div>
                </div>
              )}

              {devOtpHint && (
                <div style={{
                  background: '#fffbeb',
                  border: '1px solid #fde68a',
                  color: '#92400e',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  fontSize: '12.5px',
                  marginBottom: '16px'
                }}>
                  <strong>Local Verification Key:</strong> <code style={{ fontSize: '14px', fontWeight: 800, color: '#8B1E2D' }}>{devOtpHint}</code>
                </div>
              )}

              {otpStep === 1 ? (
                /* STEP 1: REQUEST OTP */
                <form onSubmit={handleRequestOTP}>
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                      Registered Admin Email or Phone Number *
                    </label>
                    <input
                      name="identity"
                      type="text"
                      placeholder="e.g. admin or +254 711 689 913"
                      required
                      style={{
                        width: '100%',
                        padding: '11px 12px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '14px',
                        color: '#1e293b',
                        boxSizing: 'border-box'
                      }}
                    />
                    <small style={{ color: '#64748b', fontSize: '11.5px', marginTop: '4px', display: 'block' }}>
                      Must match an authorized administrator email or contact registered in the portal.
                    </small>
                  </div>

                  {/* DELIVERY METHOD TOGGLE */}
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                      Choose OTP Delivery Channel *
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px',
                        borderRadius: '6px',
                        border: `1px solid ${deliveryMethod === 'email' ? '#8B1E2D' : '#cbd5e1'}`,
                        background: deliveryMethod === 'email' ? 'rgba(139,30,45,0.04)' : '#ffffff',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: deliveryMethod === 'email' ? '#8B1E2D' : '#475569'
                      }}>
                        <input
                          type="radio"
                          name="delivery_method"
                          value="email"
                          checked={deliveryMethod === 'email'}
                          onChange={() => setDeliveryMethod('email')}
                        />
                        <i className="fa-solid fa-envelope" /> Saved Email
                      </label>

                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px',
                        borderRadius: '6px',
                        border: `1px solid ${deliveryMethod === 'sms' ? '#8B1E2D' : '#cbd5e1'}`,
                        background: deliveryMethod === 'sms' ? 'rgba(139,30,45,0.04)' : '#ffffff',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: deliveryMethod === 'sms' ? '#8B1E2D' : '#475569'
                      }}>
                        <input
                          type="radio"
                          name="delivery_method"
                          value="sms"
                          checked={deliveryMethod === 'sms'}
                          onChange={() => setDeliveryMethod('sms')}
                        />
                        <i className="fa-solid fa-mobile-screen-button" /> Saved Phone
                      </label>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '22px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                      New Administrative Password *
                    </label>
                    <input
                      name="new_password"
                      type="password"
                      placeholder="Enter strong new password (min. 6 characters)"
                      minLength={6}
                      required
                      style={{
                        width: '100%',
                        padding: '11px 12px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '14px',
                        color: '#1e293b',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isOtpPending}
                    style={{
                      width: '100%',
                      background: '#1E232A',
                      color: '#ffffff',
                      border: 'none',
                      padding: '13px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: isOtpPending ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <i className="fa-solid fa-paper-plane" />
                    {isOtpPending ? 'Validating & Dispatching OTP...' : `Send Verification OTP via ${deliveryMethod.toUpperCase()}`}
                  </button>
                </form>
              ) : (
                /* STEP 2: VERIFY OTP */
                <form onSubmit={handleVerifyOTP}>
                  <div style={{ marginBottom: '16px', fontSize: '13px', color: '#475569' }}>
                    Please enter the 6-digit code received on your registered device/inbox for account:
                    <div style={{ fontWeight: 700, color: '#1E232A', marginTop: '3px' }}>{targetKey}</div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                      6-Digit Verification OTP Code *
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        textAlign: 'center',
                        letterSpacing: '8px',
                        fontSize: '22px',
                        fontWeight: 800,
                        border: '2px solid #8B1E2D',
                        borderRadius: '6px',
                        color: '#1E232A',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => { setOtpStep(1); setOtpStatus(null); }}
                      style={{
                        background: '#f1f5f9',
                        color: '#475569',
                        border: '1px solid #cbd5e1',
                        padding: '11px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      &larr; Back
                    </button>
                    <button
                      type="submit"
                      disabled={isOtpPending || otpCode.length < 6}
                      style={{
                        background: 'linear-gradient(135deg, #8B1E2D 0%, #6D1421 100%)',
                        color: '#ffffff',
                        border: 'none',
                        padding: '11px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: isOtpPending || otpCode.length < 6 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isOtpPending ? 'Verifying...' : 'Confirm & Save'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* FOOTER METADATA / BADGES */}
          <div style={{
            background: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            padding: '14px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
            color: '#64748b'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <i className="fa-solid fa-lock" style={{ color: '#16a34a' }} /> 256-Bit SSL Encrypted
            </span>
            <span>KDPA 2019 Compliant</span>
          </div>
        </div>
      </div>
    </main>
  );
}
