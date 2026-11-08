'use client';
import { useState, useTransition } from 'react';
import { callAdminAction } from '@/lib/adminClient';

export default function TelecomGatewayTester({
  initialSettings = {},
  hasEnvAtKey = false,
  hasEnvAtUser = false,
  dbHasAtKey = false,
  dbHasAtUser = false
}) {
  const [atUser, setAtUser] = useState(initialSettings.at_username || '');
  const [atKey, setAtKey] = useState(initialSettings.at_api_key || '');
  const [atSender, setAtSender] = useState(initialSettings.at_sender_id || '');
  const [adminPhone, setAdminPhone] = useState(initialSettings.admin_sms_phone || '+254 711 689 913');

  const [testPhone, setTestPhone] = useState(initialSettings.admin_sms_phone || '+254711689913');
  const [testStatus, setTestStatus] = useState(null);
  const [isTestPending, startTestTransition] = useTransition();

  const [saveStatus, setSaveStatus] = useState(null);
  const [isSavePending, startSaveTransition] = useTransition();

  const keyConfigured = hasEnvAtKey || dbHasAtKey || Boolean(atKey);
  const userConfigured = hasEnvAtUser || dbHasAtUser || Boolean(atUser);

  const handleTestSms = (e) => {
    e.preventDefault();
    setTestStatus(null);

    if (!userConfigured) {
      setTestStatus({
        type: 'error',
        message: "Africa's Talking Username (AT_USERNAME) is missing. Africa's Talking strictly requires your account username alongside your API key to authenticate SMS. Please enter your account username in the field above and click 'Save Telecom Credentials'."
      });
      return;
    }

    const fd = new FormData();
    fd.append('phone', testPhone);

    startTestTransition(async () => {
      try {
        const res = await callAdminAction('testAfricasTalking', fd);
        if (res?.ok) {
          setTestStatus({
            type: 'success',
            message: res.message || `✓ Verification SMS dispatched successfully to ${testPhone}!`
          });
        } else {
          setTestStatus({
            type: 'error',
            message: res?.error || "Failed to dispatch SMS through Africa's Talking."
          });
        }
      } catch (err) {
        setTestStatus({
          type: 'error',
          message: err?.message || 'Network error communicating with telecom gateway.'
        });
      }
    });
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaveStatus(null);
    const fd = new FormData(e.currentTarget);

    startSaveTransition(async () => {
      try {
        const res = await callAdminAction('saveApiIntegrations', fd);
        if (res?.ok) {
          setSaveStatus({
            type: 'success',
            message: "✓ Africa's Talking credentials and recipient handsets saved and synced live!"
          });
          setTimeout(() => setSaveStatus(null), 6000);
        } else {
          setSaveStatus({
            type: 'error',
            message: res?.error || 'Failed to save settings.'
          });
        }
      } catch (err) {
        setSaveStatus({
          type: 'error',
          message: err?.message || 'Error saving settings.'
        });
      }
    });
  };

  return (
    <div style={{ background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px', padding: '22px', marginBottom: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '17px', color: 'var(--primary-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa-solid fa-tower-broadcast" style={{ color: 'var(--primary-red)' }} />
            Africa&apos;s Talking Gateway &amp; Live SMS Telemetry
          </h4>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
            Configure telecom credentials so parent inquiries, tour bookings, and direct messages forward immediately to your phone.
          </p>
        </div>

        {/* STATUS PILLS */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '20px',
            fontSize: '11.5px',
            fontWeight: 700,
            background: keyConfigured ? '#f0fdf4' : '#fef2f2',
            color: keyConfigured ? '#15803d' : '#991b1b',
            border: `1px solid ${keyConfigured ? '#86efac' : '#fecaca'}`
          }}>
            <i className={`fa-solid ${keyConfigured ? 'fa-check' : 'fa-xmark'}`} />
            API Key: {keyConfigured ? (hasEnvAtKey ? 'Connected (Environment)' : 'Connected (Saved in Portal)') : 'Missing'}
          </span>

          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '20px',
            fontSize: '11.5px',
            fontWeight: 700,
            background: userConfigured ? '#f0fdf4' : '#fffbeb',
            color: userConfigured ? '#15803d' : '#b45309',
            border: `1px solid ${userConfigured ? '#86efac' : '#fde68a'}`
          }}>
            <i className={`fa-solid ${userConfigured ? 'fa-user-check' : 'fa-triangle-exclamation'}`} />
            Username: {userConfigured ? (hasEnvAtUser ? 'Connected (Environment)' : `Connected (${atUser || initialSettings.at_username})`) : 'Required (Missing)'}
          </span>
        </div>
      </div>

      {/* ACTIONABLE GUIDANCE BANNERS */}
      {keyConfigured && !userConfigured && (
        <div style={{
          background: '#eff6ff',
          border: '1.5px solid #93c5fd',
          borderRadius: '6px',
          padding: '14px 16px',
          fontSize: '13px',
          color: '#1e3a8a',
          lineHeight: 1.5,
          marginBottom: '18px',
          display: 'flex',
          gap: '12px'
        }}>
          <i className="fa-solid fa-circle-info" style={{ marginTop: '2px', color: '#2563eb', fontSize: '18px' }} />
          <div>
            <strong>API Key Detected &mdash; One Final Step: Enter your Africa&apos;s Talking Username (AT_USERNAME)</strong>
            <p style={{ margin: '6px 0 0', fontSize: '12.5px', color: '#1e3a8a' }}>
              Your API key is active. However, unlike standard single-token APIs, Africa&apos;s Talking API keys are strictly tied to a specific account username. Mobile telecom carriers in Kenya require <strong>both</strong> the API Key and your Account Username:
            </p>
            <ul style={{ margin: '6px 0 6px 18px', padding: 0, fontSize: '12.5px', color: '#1e3a8a' }}>
              <li><strong>Where to find it:</strong> Look at the very top-right corner of your <a href="https://account.africastalking.com" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', fontWeight: 700, color: '#1d4ed8' }}>Africa&apos;s Talking Console</a>. It is your account or app name (e.g. <code>pleasantviewschools</code>, or your login username, or <code>sandbox</code> for testing).</li>
              <li><strong>Instant Live Activation:</strong> Enter it into the <em>Africa&apos;s Talking Username</em> field below and click <strong>Save Telecom Credentials</strong>. It activates immediately with zero build wait time.</li>
            </ul>
          </div>
        </div>
      )}

      {!keyConfigured && (
        <div style={{
          background: '#fffbeb',
          border: '1.5px solid #fde68a',
          borderRadius: '6px',
          padding: '12px 14px',
          fontSize: '13px',
          color: '#92400e',
          lineHeight: 1.5,
          marginBottom: '18px',
          display: 'flex',
          gap: '10px'
        }}>
          <i className="fa-solid fa-triangle-exclamation" style={{ marginTop: '2px', color: '#d97706', fontSize: '16px' }} />
          <div>
            <strong>Missing Africa&apos;s Talking Telecom Credentials:</strong>
            <p style={{ margin: '4px 0 0', fontSize: '12.5px' }}>
              To dispatch live SMS alerts for parent inquiries, tours, and staff notifications, enter your Africa&apos;s Talking <strong>Username</strong> and <strong>API Key</strong> below and tap Save Telecom Credentials.
              <em>Note: If you recently added credentials in Cloudflare Pages Dashboard &gt; Settings &gt; Environment variables, Cloudflare requires a redeployment (or you can save them here for instant live activation).</em>
            </p>
          </div>
        </div>
      )}

      {/* FORM: CREDENTIALS & HANDSET NUMBERS */}
      <form onSubmit={handleSaveSettings} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '20px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
            Africa&apos;s Talking Username (AT_USERNAME) *
          </label>
          <input
            name="at_username"
            value={atUser}
            onChange={(e) => setAtUser(e.target.value)}
            placeholder={hasEnvAtUser ? 'Configured via Environment' : (dbHasAtUser ? atUser : 'e.g. pleasantviewschools or your username')}
            required
            style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', boxSizing: 'border-box' }}
          />
          <small style={{ color: '#64748b', fontSize: '11px', display: 'block', marginTop: '2px' }}>
            {hasEnvAtUser ? 'Active via Environment.' : (dbHasAtUser ? 'Active and securely stored in portal database.' : "Account username from Africa's Talking dashboard (never 'sandbox' for live production SMS).")}
          </small>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
            API Key (AT_API_KEY)
          </label>
          <input
            name="at_api_key"
            type="password"
            value={atKey}
            onChange={(e) => setAtKey(e.target.value)}
            placeholder={hasEnvAtKey ? '●●●●●● (Active via Environment)' : (dbHasAtKey ? '●●●●●● (Saved in Portal Database)' : 'Enter Africa\'s Talking API Key')}
            style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', boxSizing: 'border-box' }}
          />
          <small style={{ color: '#64748b', fontSize: '11px', display: 'block', marginTop: '2px' }}>
            {hasEnvAtKey ? 'Active via Environment.' : (dbHasAtKey ? 'Active and securely stored in portal database.' : 'Generated under Settings > API Key.')}
          </small>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
            Sender ID (Optional)
          </label>
          <input
            name="at_sender_id"
            value={atSender}
            onChange={(e) => setAtSender(e.target.value)}
            placeholder="Leave blank for shared shortcode"
            style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', boxSizing: 'border-box' }}
          />
          <small style={{ color: '#64748b', fontSize: '11px', display: 'block', marginTop: '2px' }}>
            Leave blank to use Africa&apos;s Talking default approved sender.
          </small>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
            Admin Handsets (Receive Visitor SMS Alerts) *
          </label>
          <input
            name="admin_sms_phone"
            value={adminPhone}
            onChange={(e) => setAdminPhone(e.target.value)}
            placeholder="+254711689913, +254722000000"
            required
            style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', boxSizing: 'border-box' }}
          />
          <small style={{ color: '#64748b', fontSize: '11px', display: 'block', marginTop: '2px' }}>
            Mobile numbers receiving parent inquiries &amp; tour alerts (comma-separated).
          </small>
        </div>

        <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
          <button
            type="submit"
            disabled={isSavePending}
            style={{
              background: '#05286B',
              color: '#ffffff',
              border: 0,
              padding: '10px 18px',
              borderRadius: '5px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: isSavePending ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <i className={`fa-solid ${isSavePending ? 'fa-spinner fa-spin' : 'fa-floppy-disk'}`} />
            {isSavePending ? 'Saving & Syncing...' : 'Save Telecom Credentials'}
          </button>

          {saveStatus && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 700,
              color: saveStatus.type === 'success' ? '#15803d' : '#991b1b',
              background: saveStatus.type === 'success' ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${saveStatus.type === 'success' ? '#86efac' : '#fecaca'}`,
              padding: '6px 12px',
              borderRadius: '5px'
            }}>
              <i className={`fa-solid ${saveStatus.type === 'success' ? 'fa-circle-check' : 'fa-circle-xmark'}`} />
              {saveStatus.message}
            </span>
          )}
        </div>
      </form>

      {/* LIVE TEST SMS DISPATCH */}
      <div style={{ background: 'var(--soft-bg, #f8fafc)', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '16px' }}>
        <h5 style={{ margin: '0 0 6px', fontSize: '14px', color: 'var(--primary-navy)' }}>
          <i className="fa-solid fa-paper-plane" style={{ color: 'var(--gold-accent)', marginRight: '6px' }} />
          Verify Live Outbound SMS Delivery
        </h5>
        <p style={{ margin: '0 0 12px', fontSize: '12.5px', color: '#64748b' }}>
          Test immediate dispatch from Africa&apos;s Talking to your handset. Diagnostics will report the exact delivery status and any network carrier issues.
        </p>

        <form onSubmit={handleTestSms} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="tel"
            value={testPhone}
            onChange={(e) => setTestPhone(e.target.value)}
            placeholder="+254711689913"
            required
            style={{ padding: '8px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', width: '220px' }}
          />

          <button
            type="submit"
            disabled={isTestPending}
            style={{
              background: isTestPending ? '#64748b' : '#8B1E2D',
              color: '#ffffff',
              border: 0,
              padding: '8px 16px',
              borderRadius: '4px',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: isTestPending ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <i className={`fa-solid ${isTestPending ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`} />
            {isTestPending ? 'Testing Gateway...' : 'Send Verification SMS'}
          </button>
        </form>

        {testStatus && (
          <div style={{
            marginTop: '12px',
            padding: '10px 14px',
            borderRadius: '6px',
            fontSize: '13px',
            lineHeight: 1.5,
            background: testStatus.type === 'success' ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${testStatus.type === 'success' ? '#86efac' : '#fecaca'}`,
            color: testStatus.type === 'success' ? '#166534' : '#991b1b',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <i className={`fa-solid ${testStatus.type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'}`} style={{ marginTop: '2px' }} />
            <div>
              <strong>{testStatus.type === 'success' ? 'Gateway Success:' : 'Gateway Error:'}</strong> {testStatus.message}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}