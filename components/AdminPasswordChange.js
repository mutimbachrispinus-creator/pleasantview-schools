'use client';
import { useState, useTransition } from 'react';
import { requestPasswordChangeOTP, verifyPasswordChangeOTP } from '@/app/hidden-admin/actions';

export default function AdminPasswordChange({ defaultEmail = 'admin@pleasantviewschools.co.ke' }) {
  const [step, setStep] = useState(1); // 1 = request OTP, 2 = verify OTP
  const [email, setEmail] = useState(defaultEmail);
  const [newPassword, setNewPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [statusMsg, setStatusMsg] = useState(null); // { type: 'success' | 'error', text: '' }
  const [devOtpHint, setDevOtpHint] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleRequestOTP = (e) => {
    e.preventDefault();
    setStatusMsg(null);
    const fd = new FormData(e.currentTarget);
    const em = String(fd.get('email') || '').trim();
    const pw = String(fd.get('new_password') || '').trim();
    setEmail(em);
    setNewPassword(pw);

    startTransition(async () => {
      try {
        const res = await requestPasswordChangeOTP(fd);
        if (res?.ok) {
          setStep(2);
          setStatusMsg({
            type: 'success',
            text: `A 6-digit OTP has been automatically generated and sent to ${res.targetEmail || em}.`
          });
          if (res?.otp) {
            setDevOtpHint(res.otp);
          }
        } else {
          setStatusMsg({ type: 'error', text: res?.error || 'Failed to send OTP.' });
        }
      } catch (err) {
        setStatusMsg({ type: 'error', text: err.message });
      }
    });
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    setStatusMsg(null);
    const fd = new FormData();
    fd.append('email', email);
    fd.append('otp', otp);
    fd.append('new_password', newPassword);

    startTransition(async () => {
      try {
        const res = await verifyPasswordChangeOTP(fd);
        if (res?.ok) {
          setStatusMsg({
            type: 'success',
            text: 'Password updated successfully! You can now authenticate with your new credentials.'
          });
          setStep(3); // Completed
        } else {
          setStatusMsg({ type: 'error', text: res?.error || 'Invalid or expired OTP code.' });
        }
      } catch (err) {
        setStatusMsg({ type: 'error', text: err.message });
      }
    });
  };

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #dde2ec',
      borderRadius: '8px',
      padding: '24px',
      maxWidth: '600px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'rgba(139,30,45,0.1)',
          color: '#8B1E2D',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px'
        }}>
          <i className="fa-solid fa-shield-halved" />
        </div>
        <div>
          <h4 style={{ margin: 0, fontSize: '16px', color: '#1E232A', fontWeight: 800 }}>
            Security: Admin Password Change (OTP Verified)
          </h4>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Requires auto-generated 6-digit OTP delivered to verified admin email address.
          </span>
        </div>
      </div>

      {statusMsg && (
        <div style={{
          background: statusMsg.type === 'success' ? '#f0fdf4' : '#fef2f2',
          color: statusMsg.type === 'success' ? '#15803d' : '#b91c1c',
          border: `1px solid ${statusMsg.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
          padding: '10px 14px',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: 600,
          marginBottom: '16px'
        }}>
          {statusMsg.text}
          {devOtpHint && (
            <div style={{ marginTop: '6px', fontSize: '12px', color: '#1E232A' }}>
              Verification Code (Direct Key): <strong style={{ color: '#8B1E2D', fontSize: '14px' }}>{devOtpHint}</strong>
            </div>
          )}
        </div>
      )}

      {step === 1 && (
        <form onSubmit={handleRequestOTP} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
              Admin Email / Username *
            </label>
            <input
              name="email"
              type="text"
              defaultValue={email}
              placeholder="e.g. admin or senior@pleasantviewschools.co.ke"
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px' }}
            />
            <small style={{ color: '#64748b', fontSize: '11.5px', marginTop: '3px', display: 'block' }}>
              Central admin can use <code>admin</code> or full email address.
            </small>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
              Desired New Password *
            </label>
            <input
              name="new_password"
              type="password"
              placeholder="Minimum 6 characters..."
              required
              minLength={6}
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px' }}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            style={{
              background: '#8B1E2D',
              color: '#ffffff',
              border: 0,
              padding: '11px 18px',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '6px'
            }}
          >
            <i className="fa-solid fa-paper-plane" />
            {isPending ? 'Generating & Sending OTP...' : 'Send Verification OTP to Email'}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', fontSize: '13px', color: '#334155' }}>
            Verification code dispatched to: <strong style={{ color: '#8B1E2D' }}>{email}</strong>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
              Enter 6-Digit OTP Code *
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
              placeholder="••••••"
              maxLength={6}
              required
              autoFocus
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: '2px solid #8B1E2D',
                fontSize: '20px',
                letterSpacing: '8px',
                textAlign: 'center',
                fontWeight: 800,
                color: '#1E232A'
              }}
            />
            <small style={{ color: '#64748b', fontSize: '11.5px', marginTop: '4px', display: 'block', textAlign: 'center' }}>
              Valid for 10 minutes. Check spam folder if not in primary inbox.
            </small>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => { setStep(1); setStatusMsg(null); }}
              style={{
                background: '#f1f5f9',
                border: 0,
                padding: '11px 16px',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isPending || otp.length < 6}
              style={{
                flex: 1,
                background: otp.length === 6 ? '#8B1E2D' : '#94a3b8',
                color: '#ffffff',
                border: 0,
                padding: '11px 18px',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: otp.length === 6 ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <i className="fa-solid fa-check" />
              {isPending ? 'Verifying...' : 'Confirm & Save Password'}
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: '#dcfce7',
            color: '#15803d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            margin: '0 auto 12px'
          }}>
            <i className="fa-solid fa-circle-check" />
          </div>
          <h4 style={{ color: '#15803d', margin: '0 0 6px', fontSize: '16px' }}>Password Changed Successfully!</h4>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px' }}>
            Your account is updated with the new credentials.
          </p>
          <button
            type="button"
            onClick={() => { setStep(1); setStatusMsg(null); setOtp(''); setNewPassword(''); }}
            style={{
              background: '#1E232A',
              color: '#ffffff',
              border: 0,
              padding: '8px 16px',
              borderRadius: '4px',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Change Another Password
          </button>
        </div>
      )}
    </div>
  );
}
