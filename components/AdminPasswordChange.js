'use client';
import { useState, useTransition } from 'react';
import { saveAdminRecoveryProfile, requestPasswordChangeOTP, verifyPasswordChangeOTP } from '@/app/hidden-admin/actions';

export default function AdminPasswordChange({
  defaultEmail = 'admin@pleasantviewschools.co.ke',
  defaultPhone = '+254 711 689 913'
}) {
  // Mode: 'profile' (Save recovery email/phone) | 'otp-test' (Test OTP flow)
  const [activeTab, setActiveTab] = useState('profile');

  // Recovery Profile State
  const [recoveryEmail, setRecoveryEmail] = useState(defaultEmail);
  const [recoveryPhone, setRecoveryPhone] = useState(defaultPhone);
  const [profilePassword, setProfilePassword] = useState('');
  const [profileStatus, setProfileStatus] = useState(null);
  const [isProfilePending, startProfileTransition] = useTransition();

  // OTP Test Flow State
  const [otpStep, setOtpStep] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState('email');
  const [testPassword, setTestPassword] = useState('');
  const [targetKey, setTargetKey] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpStatus, setOtpStatus] = useState(null);
  const [isOtpPending, startOtpTransition] = useTransition();

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfileStatus(null);
    const fd = new FormData(e.currentTarget);

    startProfileTransition(async () => {
      try {
        const res = await saveAdminRecoveryProfile(fd);
        if (res?.ok) {
          setProfileStatus({
            type: 'success',
            text: res.message || 'Administrator recovery details saved successfully!'
          });
          setProfilePassword('');
        } else {
          setProfileStatus({
            type: 'error',
            text: res?.error || 'Failed to update recovery profile.'
          });
        }
      } catch (err) {
        setProfileStatus({
          type: 'error',
          text: err?.message || 'Error communicating with security desk.'
        });
      }
    });
  };

  const handleRequestOTP = (e) => {
    e.preventDefault();
    setOtpStatus(null);
    const fd = new FormData(e.currentTarget);
    const pw = String(fd.get('new_password') || '').trim();
    setTestPassword(pw);

    startOtpTransition(async () => {
      try {
        const res = await requestPasswordChangeOTP(fd);
        if (res?.ok) {
          setOtpStep(2);
          if (res?.targetKey) setTargetKey(res.targetKey);
          setOtpStatus({
            type: 'success',
            text: res.message || 'OTP verification code successfully dispatched.'
          });
        } else {
          setOtpStatus({
            type: 'error',
            text: res?.error || 'Unable to dispatch OTP. Please verify your details.'
          });
        }
      } catch (err) {
        setOtpStatus({
          type: 'error',
          text: err?.message || 'Error processing OTP request.'
        });
      }
    });
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    setOtpStatus(null);
    const fd = new FormData();
    fd.append('target_key', targetKey || recoveryEmail);
    fd.append('identity', recoveryEmail);
    fd.append('otp', otpCode);
    fd.append('new_password', testPassword);

    startOtpTransition(async () => {
      try {
        const res = await verifyPasswordChangeOTP(fd);
        if (res?.ok) {
          setOtpStatus({
            type: 'success',
            text: res.message || 'Password verified and updated successfully in database!'
          });
          setOtpStep(1);
          setOtpCode('');
          setTestPassword('');
        } else {
          setOtpStatus({
            type: 'error',
            text: res?.error || 'Invalid or expired OTP code.'
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
    <div style={{
      background: '#ffffff',
      border: '1px solid #dde2ec',
      borderRadius: '8px',
      padding: '24px',
      maxWidth: '750px',
      boxShadow: '0 4px 18px rgba(0,0,0,0.04)'
    }}>
      {/* HEADER WITH BADGE */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          background: 'rgba(139,30,45,0.1)',
          color: '#8B1E2D',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px'
        }}>
          <i className="fa-solid fa-shield-halved" />
        </div>
        <div>
          <h4 style={{ margin: 0, fontSize: '17px', color: '#1E232A', fontWeight: 800 }}>
            Administrator Security, Recovery Contacts &amp; Password Management
          </h4>
          <span style={{ fontSize: '13px', color: '#64748b' }}>
            Configure the verified email address and mobile phone number that receive OTP password reset codes.
          </span>
        </div>
      </div>

      {/* DUAL MODE TABS */}
      <div style={{
        display: 'flex',
        borderBottom: '2px solid #e2e8f0',
        marginBottom: '20px',
        gap: '10px'
      }}>
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          style={{
            padding: '10px 16px',
            fontSize: '13.5px',
            fontWeight: 700,
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'profile' ? '3px solid #8B1E2D' : '3px solid transparent',
            color: activeTab === 'profile' ? '#8B1E2D' : '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <i className="fa-solid fa-address-card" /> Save Recovery Contacts
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('otp-test')}
          style={{
            padding: '10px 16px',
            fontSize: '13.5px',
            fontWeight: 700,
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'otp-test' ? '3px solid #8B1E2D' : '3px solid transparent',
            color: activeTab === 'otp-test' ? '#8B1E2D' : '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <i className="fa-solid fa-key" /> Test OTP Reset Flow
        </button>
      </div>

      {/* TAB 1: SAVE RECOVERY CONTACTS */}
      {activeTab === 'profile' && (
        <div>
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            padding: '14px',
            marginBottom: '18px',
            fontSize: '13px',
            color: '#334155',
            lineHeight: 1.6
          }}>
            <strong style={{ color: '#8B1E2D' }}><i className="fa-solid fa-circle-info" /> Security Protocol:</strong> The email and phone number saved below are registered in the portal database. When anyone requests a password change from the login page, the system verifies that the contact matches this profile before dispatching a 6-digit OTP.
          </div>

          {profileStatus && (
            <div style={{
              background: profileStatus.type === 'success' ? '#f0fdf4' : '#fef2f2',
              color: profileStatus.type === 'success' ? '#166534' : '#991b1b',
              border: `1px solid ${profileStatus.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
              padding: '12px 14px',
              borderRadius: '6px',
              fontSize: '13.5px',
              fontWeight: 600,
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px'
            }}>
              <i className={`fa-solid ${profileStatus.type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'}`} style={{ marginTop: '2px' }} />
              <div>{profileStatus.text}</div>
            </div>
          )}

          <form onSubmit={handleSaveProfile} style={{ display: 'grid', gap: '16px' }}>
            <div className="form-group">
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                Administrator Recovery Email Address *
              </label>
              <input
                name="recovery_email"
                type="email"
                defaultValue={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                placeholder="e.g. admin@pleasantviewschools.co.ke"
                required
                style={{
                  width: '100%',
                  padding: '11px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  color: '#1e293b',
                  boxSizing: 'border-box'
                }}
              />
              <small style={{ color: '#64748b', fontSize: '11.5px', marginTop: '4px', display: 'block' }}>
                Password reset OTPs sent via Email channel will be dispatched to this verified address.
              </small>
            </div>

            <div className="form-group">
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                Administrator Recovery Mobile Phone Number (+254...) *
              </label>
              <input
                name="recovery_phone"
                type="text"
                defaultValue={recoveryPhone}
                onChange={(e) => setRecoveryPhone(e.target.value)}
                placeholder="e.g. +254 711 689 913"
                required
                style={{
                  width: '100%',
                  padding: '11px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  color: '#1e293b',
                  boxSizing: 'border-box'
                }}
              />
              <small style={{ color: '#64748b', fontSize: '11.5px', marginTop: '4px', display: 'block' }}>
                Password reset OTPs sent via SMS channel will be dispatched to this mobile handset.
              </small>
            </div>

            <div className="form-group">
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                Update Administrator Master Password (Optional)
              </label>
              <input
                name="new_password"
                type="password"
                value={profilePassword}
                onChange={(e) => setProfilePassword(e.target.value)}
                placeholder="Leave blank to keep existing password, or enter new password (min. 6 characters)"
                minLength={6}
                style={{
                  width: '100%',
                  padding: '11px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  color: '#1e293b',
                  boxSizing: 'border-box'
                }}
              />
              <small style={{ color: '#64748b', fontSize: '11.5px', marginTop: '4px', display: 'block' }}>
                Updating the password here saves directly to the database, decoupled from GitHub source code.
              </small>
            </div>

            <div className="form-group">
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                Resend Email API Key (RESEND_API_KEY) (Optional)
              </label>
              <input
                name="resend_api_key"
                type="text"
                placeholder="re_xxxxxxxxxxxxxxxxxxxxxxxx"
                style={{
                  width: '100%',
                  padding: '11px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  color: '#1e293b',
                  boxSizing: 'border-box'
                }}
              />
              <small style={{ color: '#64748b', fontSize: '11.5px', marginTop: '4px', display: 'block' }}>
                Save your Resend API key here directly, or add it in Cloudflare Pages Dashboard &gt; Settings &gt; Environment variables.
              </small>
            </div>

            <button
              type="submit"
              disabled={isProfilePending}
              style={{
                background: '#8B1E2D',
                color: '#ffffff',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: isProfilePending ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '6px'
              }}
            >
              <i className="fa-solid fa-floppy-disk" />
              {isProfilePending ? 'Saving Security Profile...' : 'Save Administrator Recovery Profile & Credentials'}
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: TEST OTP RESET FLOW */}
      {activeTab === 'otp-test' && (
        <div>
          {otpStatus && (
            <div style={{
              background: otpStatus.type === 'success' ? '#f0fdf4' : '#fef2f2',
              color: otpStatus.type === 'success' ? '#166534' : '#991b1b',
              border: `1px solid ${otpStatus.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
              padding: '12px 14px',
              borderRadius: '6px',
              fontSize: '13.5px',
              fontWeight: 600,
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px'
            }}>
              <i className={`fa-solid ${otpStatus.type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'}`} style={{ marginTop: '2px' }} />
              <div>{otpStatus.text}</div>
            </div>
          )}

          {otpStep === 1 ? (
            <form onSubmit={handleRequestOTP} style={{ display: 'grid', gap: '16px' }}>
              <input type="hidden" name="identity" value={recoveryEmail || 'admin'} />

              <div className="form-group">
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  Choose OTP Delivery Channel
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 12px',
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
                    <i className="fa-solid fa-envelope" /> Saved Email ({recoveryEmail})
                  </label>

                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 12px',
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
                    <i className="fa-solid fa-mobile-screen-button" /> Saved Phone ({recoveryPhone})
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  Desired New Test Password *
                </label>
                <input
                  name="new_password"
                  type="password"
                  placeholder="Enter minimum 6 characters..."
                  minLength={6}
                  required
                  style={{
                    width: '100%',
                    padding: '11px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isOtpPending}
                style={{
                  background: '#1E232A',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 20px',
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
                {isOtpPending ? 'Dispatching Test OTP...' : `Dispatch OTP to Saved ${deliveryMethod.toUpperCase()}`}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} style={{ display: 'grid', gap: '16px' }}>
              <div style={{
                background: '#f8fafc',
                padding: '12px',
                borderRadius: '6px',
                fontSize: '13px',
                color: '#334155'
              }}>
                Verification code dispatched to your saved {deliveryMethod === 'sms' ? `phone (${recoveryPhone})` : `email (${recoveryEmail})`}.
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  Enter 6-Digit Verification OTP *
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
                    cursor: otpCode.length === 6 ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <i className="fa-solid fa-check" />
                  {isOtpPending ? 'Verifying OTP...' : 'Verify OTP & Finalize Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
