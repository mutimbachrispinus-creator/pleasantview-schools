'use client';
import { useState, useTransition } from 'react';
import Link from 'next/link';
import BackButton from '@/components/BackButton';
import { callAdminAction } from '@/lib/adminClient';

export default function LoginForm({ k = '', title = 'Staff & Admin Console' }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'otp'
  const [loginError, setLoginError] = useState('');
  const [isLoginPending, startLoginTransition] = useTransition();

  // Credentials Login State
  const [loginPassword, setLoginPassword] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [inputReady, setInputReady] = useState(false);

  // Password Reset OTP State
  const [otpStep, setOtpStep] = useState(1); // 1 = request, 2 = verify
  const [deliveryMethod, setDeliveryMethod] = useState('email'); // 'email' | 'sms'
  const [identity, setIdentity] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [targetKey, setTargetKey] = useState('');
  const [otpStatus, setOtpStatus] = useState(null); // { type: 'success' | 'error', text: '' }
  const [isOtpPending, startOtpTransition] = useTransition();

  // DIRECT LOGIN: Verify credentials and sign in directly (NO OTP on login)
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    const fd = new FormData(e.currentTarget);
    // Erase password from component state immediately to prevent memory retention
    setLoginPassword('');

    startLoginTransition(async () => {
      try {
        const res = await callAdminAction('login', fd);
        if (res && res.error) {
          setLoginError(res.error);
        } else if (res && res.ok) {
          window.location.href = '/staff-portal';
        } else {
          setLoginError('Authentication failed. Please check your username and password.');
        }
      } catch (err) {
        setLoginError(err?.message || 'Authentication service error. Please try again.');
      }
    });
  };

  // PASSWORD RESET: REQUEST OTP
  const handleRequestOTP = (e) => {
    e.preventDefault();
    setOtpStatus(null);
    const fd = new FormData(e.currentTarget);
    const idVal = String(fd.get('identity') || '').trim();
    const pwVal = String(fd.get('new_password') || '').trim();
    setIdentity(idVal);
    setNewPassword(pwVal);

    startOtpTransition(async () => {
      try {
        const res = await callAdminAction('requestPasswordChangeOTP', fd);
        if (res?.ok) {
          setTargetKey(res.targetKey || idVal);
          setOtpStep(2);
          setOtpStatus({
            type: 'success',
            text: res.message || 'OTP verification code dispatched to your registered address.'
          });
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

  // PASSWORD RESET: VERIFY OTP & APPLY PASSWORD
  const handleVerifyOTP = (e) => {
    e.preventDefault();
    setOtpStatus(null);
    const fd = new FormData();
    fd.append('target_key', targetKey);
    fd.append('otp', otpCode);
    fd.append('new_password', newPassword);

    startOtpTransition(async () => {
      try {
        const res = await callAdminAction('verifyPasswordChangeOTP', fd);
        if (res?.ok) {
          setOtpStatus({
            type: 'success',
            text: res.message || 'Password updated successfully! You may now sign in.'
          });
          setOtpStep(1);
          setOtpCode('');
          setNewPassword('');
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

        <div className="login-panel-card" style={{
          maxWidth: '520px',
          width: '100%',
          margin: '25px auto 40px',
          background: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 15px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}>
          {/* LUXURY TOP HEADER: Synchronized Crest Emblem (No Artificial Background Box) */}
          <div style={{
            background: 'linear-gradient(135deg, #1E232A 0%, #2A313C 100%)',
            padding: '30px 24px 24px',
            textAlign: 'center',
            borderBottom: '3px solid #8B1E2D'
          }}>
            <div style={{
              width: '88px',
              height: '88px',
              margin: '0 auto 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src="/images/pvs_crest.png?v=20261107b"
                alt="Pleasant View Schools Official Crest"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.25))'
                }}
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
                padding: '13px',
                border: 'none',
                background: activeTab === 'login' ? '#ffffff' : 'transparent',
                fontWeight: 700,
                fontSize: '13.5px',
                color: activeTab === 'login' ? '#8B1E2D' : '#64748b',
                borderBottom: activeTab === 'login' ? '3px solid #8B1E2D' : '3px solid transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <i className="fa-solid fa-lock" /> Administrator Sign In
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('otp'); setOtpStatus(null); setOtpStep(1); }}
              style={{
                flex: 1,
                padding: '13px',
                border: 'none',
                background: activeTab === 'otp' ? '#ffffff' : 'transparent',
                fontWeight: 700,
                fontSize: '13.5px',
                color: activeTab === 'otp' ? '#8B1E2D' : '#64748b',
                borderBottom: activeTab === 'otp' ? '3px solid #8B1E2D' : '3px solid transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <i className="fa-solid fa-key" /> Reset Password (OTP)
            </button>
          </div>

          {/* TAB 1: DIRECT CREDENTIALS SIGN-IN (USERNAME & PASSWORD) */}
          {activeTab === 'login' && (
            <div className="login-panel-body" style={{ padding: '26px 28px 30px' }}>
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

              {/* DIRECT CREDENTIALS SIGN-IN (USERNAME & PASSWORD) - NO AUTOFILL, NO PASSWORD SAVING */}
              <form
                onSubmit={handleLoginSubmit}
                autoComplete="off"
                data-form-type="other"
                data-lpignore="true"
                data-1p-ignore="true"
              >
                {/* Decoy fields to intercept aggressive browser autofill bots */}
                <input type="text" name="decoy_user" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
                <input type="password" name="decoy_pass" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

                <input type="hidden" name="key" value={k} />

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '18px',
                  color: '#64748b',
                  fontSize: '13px'
                }}>
                  <i className="fa-solid fa-shield-halved" style={{ color: '#8B1E2D' }} />
                  <span>Manual credential entry required. Passwords are never saved or remembered.</span>
                </div>

                <div className="form-group" style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                    Admin Username or Department Email *
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
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      placeholder="e.g. admin or senior@pleasantviewschools.co.ke"
                      autoComplete="off"
                      data-lpignore="true"
                      data-1p-ignore="true"
                      data-bwignore="true"
                      data-dashlane-ignore="true"
                      readOnly={!inputReady}
                      onFocus={() => setInputReady(true)}
                      onPointerDown={() => setInputReady(true)}
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
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                    Password *
                  </label>
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
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Type administrator password manually"
                      autoComplete="new-password"
                      data-lpignore="true"
                      data-1p-ignore="true"
                      data-bwignore="true"
                      data-dashlane-ignore="true"
                      readOnly={!inputReady}
                      onFocus={() => setInputReady(true)}
                      onPointerDown={() => setInputReady(true)}
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
                  <i className="fa-solid fa-right-to-bracket" />
                  {isLoginPending ? 'Signing In...' : 'Sign In to Staff Portal'}
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

          {/* TAB 2: OTP PASSWORD CHANGE (RESTRICTED TO REGISTERED PORTAL CONTACTS) */}
          {activeTab === 'otp' && (
            <div className="login-panel-body" style={{ padding: '24px 28px 30px' }}>
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
                <i className="fa-solid fa-shield-halved" style={{ color: '#8B1E2D', marginRight: '6px' }} />
                <strong>Institutional Security Protocol:</strong> One-Time Passwords (OTP) are dispatched directly to verified emails or phone numbers already registered in the Pleasant View portal database. Codes are never displayed in the browser.
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

              {otpStep === 1 ? (
                /* STEP 1: REQUEST PASSWORD RESET OTP */
                <form onSubmit={handleRequestOTP} autoComplete="off">
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                      Registered Admin Email or Phone Number *
                    </label>
                    <input
                      name="identity"
                      type="text"
                      placeholder="e.g. admin or mutimbachrispinus@gmail.com"
                      autoComplete="off"
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
                    <div className="radio-grid-two-col">
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
                      autoComplete="new-password"
                      data-lpignore="true"
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
                      fontSize: '14.5px',
                      fontWeight: 700,
                      cursor: isOtpPending ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <i className="fa-solid fa-paper-plane" />
                    {isOtpPending ? 'Dispatching Verification Code...' : `Dispatch Code to Saved ${deliveryMethod.toUpperCase()}`}
                  </button>
                </form>
              ) : (
                /* STEP 2: VERIFY CODE & APPLY NEW PASSWORD */
                <form onSubmit={handleVerifyOTP}>
                  <div style={{
                    background: '#f8fafc',
                    padding: '12px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: '#334155',
                    marginBottom: '16px',
                    lineHeight: 1.5
                  }}>
                    Verification code dispatched via {deliveryMethod.toUpperCase()}. Please check your inbox and enter the 6 digits received.
                  </div>

                  <div className="form-group" style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                      Enter 6-Digit OTP Code *
                    </label>
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                      placeholder="••••••"
                      maxLength={6}
                      required
                      autoFocus
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '6px',
                        border: '2px solid #8B1E2D',
                        fontSize: '22px',
                        letterSpacing: '8px',
                        textAlign: 'center',
                        fontWeight: 800,
                        color: '#1E232A',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => { setOtpStep(1); setOtpStatus(null); }}
                      style={{
                        background: '#f1f5f9',
                        border: 0,
                        padding: '12px 18px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isOtpPending || otpCode.length < 6}
                      style={{
                        flex: 1,
                        background: otpCode.length === 6 ? '#8B1E2D' : '#94a3b8',
                        color: '#ffffff',
                        border: 0,
                        padding: '12px 20px',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: 700,
                        cursor: otpCode.length === 6 && !isOtpPending ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <i className="fa-solid fa-check" />
                      {isOtpPending ? 'Verifying...' : 'Verify OTP & Update Password'}
                    </button>
                  </div>
                </form>
              )}

              <div style={{
                marginTop: '20px',
                textAlign: 'center',
                paddingTop: '16px',
                borderTop: '1px solid #f1f5f9'
              }}>
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); setLoginError(''); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  &larr; Return to Sign In
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
