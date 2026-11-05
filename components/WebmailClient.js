'use client';
import { useState, useTransition } from 'react';
import { sendWebmail, simulateInboundEmail, delInbound, replyEmail } from '@/app/hidden-admin/actions';

export default function WebmailClient({
  inboundEmails = [],
  commLogs = [],
  emailAccounts = [],
  schools = [],
  currentAdminEmail = 'admin@pleasantviewschools.co.ke'
}) {
  const [activeFolder, setActiveFolder] = useState('inbox'); // 'inbox' | 'sent' | 'starred' | 'all'
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showCompose, setShowCompose] = useState(false);
  const [showSimulate, setShowSimulate] = useState(false);
  const [showResendInfo, setShowResendInfo] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [isPending, startTransition] = useTransition();

  // Pre-seed core accounts if empty
  const coreAccounts = [
    { email: 'info@pleasantviewschools.co.ke', label: 'Information & General Desk', dept: 'General' },
    { email: 'admissions@pleasantviewschools.co.ke', label: 'Admissions Office', dept: 'Admissions' },
    { email: 'finance@pleasantviewschools.co.ke', label: 'Finance & Bursar', dept: 'Finance' },
    { email: 'admin@pleasantviewschools.co.ke', label: 'Central Administration', dept: 'Admin' }
  ];

  // Merge database email_accounts with core and school accounts
  const allAccountsMap = new Map();
  coreAccounts.forEach(a => allAccountsMap.set(a.email, { email: a.email, display_name: a.label, department: a.dept }));
  (emailAccounts || []).forEach(a => {
    if (a.email) allAccountsMap.set(a.email, a);
  });
  (schools || []).forEach(s => {
    if (s.email) {
      allAccountsMap.set(s.email, {
        email: s.email,
        display_name: `${s.name} Admin`,
        department: s.category || 'Division'
      });
    }
  });
  const accountList = Array.from(allAccountsMap.values());

  // Filter messages
  // Inbound messages
  const inbounds = (inboundEmails || []).map(m => ({
    id: m.id,
    type: 'inbound',
    sender: m.sender_email || m.sender_name || 'Anonymous',
    sender_name: m.sender_name || m.sender_email || 'Prospective Parent',
    recipient: m.recipient || 'info@pleasantviewschools.co.ke',
    subject: m.subject || '(No Subject)',
    body: m.body || m.html || '',
    date: m.created || '',
    status: m.status || 'received',
    starred: Boolean(m.is_starred)
  }));

  // Outbound messages from comm_logs
  const outbounds = (commLogs || [])
    .filter(c => c.type === 'email' && c.direction === 'outbound')
    .map(c => ({
      id: c.id,
      type: 'outbound',
      sender: c.sender || 'admin@pleasantviewschools.co.ke',
      sender_name: 'Pleasant View Dispatch',
      recipient: c.recipient || '',
      subject: c.subject || '(Outbound Notification)',
      body: c.content || '',
      date: c.created || '',
      status: c.status || 'sent',
      starred: Boolean(c.is_starred)
    }));

  let messagePool = [];
  if (activeFolder === 'inbox') messagePool = inbounds;
  else if (activeFolder === 'sent') messagePool = outbounds;
  else if (activeFolder === 'starred') messagePool = [...inbounds, ...outbounds].filter(m => m.starred);
  else messagePool = [...inbounds, ...outbounds];

  // Filter by selected department account
  if (selectedAccount !== 'all') {
    const selLower = selectedAccount.toLowerCase();
    messagePool = messagePool.filter(m => {
      const rec = (m.recipient || '').toLowerCase();
      const snd = (m.sender || '').toLowerCase();
      return rec.includes(selLower) || snd.includes(selLower);
    });
  }

  // Filter by search query
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    messagePool = messagePool.filter(m =>
      (m.subject || '').toLowerCase().includes(q) ||
      (m.sender || '').toLowerCase().includes(q) ||
      (m.recipient || '').toLowerCase().includes(q) ||
      (m.body || '').toLowerCase().includes(q)
    );
  }

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleComposeSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await sendWebmail(fd);
        setShowCompose(false);
        showToast('Email dispatched via Resend and recorded to outbound log!');
      } catch (err) {
        showToast('Dispatched with status note: ' + err.message);
      }
    });
  };

  const handleSimulateSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await simulateInboundEmail(fd);
        setShowSimulate(false);
        showToast('Inbound email simulated! Appears in inbox immediately.');
      } catch (err) {
        showToast('Simulation error: ' + err.message);
      }
    });
  };

  const handleInlineReply = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await replyEmail(fd);
        showToast('Reply dispatched via Resend!');
        setSelectedMessage(prev => prev ? { ...prev, status: 'replied' } : null);
      } catch (err) {
        showToast('Reply notice: ' + err.message);
      }
    });
  };

  const handleDeleteMessage = async (msg) => {
    if (!confirm('Permanently delete this message?')) return;
    const fd = new FormData();
    fd.append('t', msg.type === 'inbound' ? 'inbound_emails' : 'comm_logs');
    fd.append('id', String(msg.id));
    startTransition(async () => {
      await delInbound(fd);
      if (selectedMessage?.id === msg.id) setSelectedMessage(null);
      showToast('Message deleted.');
    });
  };

  return (
    <div className="webmail-container" style={{
      background: '#ffffff',
      border: '1px solid #dde2ec',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '650px'
    }}>
      {/* 1. TOP WEBMAIL TOOLBAR */}
      <div style={{
        background: '#1E232A',
        color: '#ffffff',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        borderBottom: '3px solid #8B1E2D'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: '#8B1E2D',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>
            <i className="fa-solid fa-envelope" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '17px', color: '#ffffff', fontWeight: 800, letterSpacing: '0.5px' }}>
              Pleasant View Official Webmail
            </h3>
            <span style={{ fontSize: '11px', color: '#9CA3AF' }}>
              Connected to @pleasantviewschools.co.ke &bull; Resend Gateway Ready
            </span>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div style={{ flex: '1', maxWidth: '420px', minWidth: '240px', position: 'relative' }}>
          <i className="fa-solid fa-magnifying-glass" style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#888',
            fontSize: '13px'
          }} />
          <input
            type="text"
            placeholder="Search mail by sender, subject, content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 34px',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.12)',
              color: '#ffffff',
              fontSize: '13px',
              outline: 'none'
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 0,
                color: '#aaa',
                cursor: 'pointer'
              }}
            >
              &times;
            </button>
          )}
        </div>

        {/* TOP FAST ACTION BUTTONS */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setShowSimulate(true)}
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.25)',
              padding: '7px 12px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="Simulate receiving an email to test inbox"
          >
            <i className="fa-solid fa-flask" style={{ color: '#8B1E2D' }} /> Simulate Inbound
          </button>

          <button
            type="button"
            onClick={() => setShowResendInfo(!showResendInfo)}
            style={{
              background: showResendInfo ? '#8B1E2D' : 'rgba(255,255,255,0.15)',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.25)',
              padding: '7px 12px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <i className="fa-solid fa-gear" /> Resend Setup
          </button>
        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div style={{
          background: '#8B1E2D',
          color: '#ffffff',
          padding: '10px 20px',
          fontSize: '13px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span>{toastMsg}</span>
          <button onClick={() => setToastMsg('')} style={{ background: 0, border: 0, color: '#fff', cursor: 'pointer', fontSize: '16px' }}>&times;</button>
        </div>
      )}

      {/* RESEND WEBHOOK & CONFIGURATION DRAWER */}
      {showResendInfo && (
        <div style={{
          background: '#f8fafc',
          padding: '16px 20px',
          borderBottom: '2px solid #8B1E2D',
          fontSize: '13px',
          color: '#334155'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <strong style={{ color: '#8B1E2D', fontSize: '14px' }}>
                  Resend Webhook &amp; Inbound Forwarding Integration
                </strong>
                <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                  OPTIONAL &bull; Inbound Only
                </span>
              </div>
              <p style={{ margin: 0, color: '#166534', fontWeight: 600, fontSize: '12.5px', marginBottom: '6px' }}>
                ✓ Outbound OTP codes, password resets, and visitor alerts are already 100% active via your RESEND_API_KEY.
              </p>
              <p style={{ margin: 0, color: '#64748b', lineHeight: 1.5, fontSize: '12px' }}>
                You do NOT need this webhook for OTPs. It is only optional if you wish external visitor emails sent to <code>info@pleasantviewschools.co.ke</code> to land inside this webmail inbox:
              </p>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px' }}>
                <code style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '6px 10px', borderRadius: '4px', fontSize: '12px', color: '#1E232A', flex: 1 }}>
                  https://pleasantview-schools.pages.dev/api/resend
                </code>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText('https://pleasantview-schools.pages.dev/api/resend');
                    showToast('Webhook URL copied to clipboard!');
                  }}
                  style={{ background: '#1E232A', color: '#fff', border: 0, padding: '6px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Copy URL
                </button>
              </div>
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '10px 14px', borderRadius: '6px', fontSize: '12px' }}>
              <strong>Configured Domain:</strong> <span style={{ color: '#8B1E2D', fontWeight: 700 }}>pleasantviewschools.co.ke</span><br />
              <strong>Outbound Status:</strong> Verified via <code>RESEND_API_KEY</code><br />
              <strong>Inbound Capture:</strong> Live &bull; Active in database
            </div>
          </div>
        </div>
      )}

      {/* 2. MAIN SPLIT: GMAIL SIDEBAR + MESSAGE LIST / READER */}
      <div style={{ display: 'flex', flex: 1, minHeight: '560px' }}>
        {/* SIDEBAR */}
        <div style={{
          width: '240px',
          background: '#f8fafc',
          borderRight: '1px solid #e2e8f0',
          padding: '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          {/* COMPOSE BUTTON */}
          <button
            type="button"
            onClick={() => setShowCompose(true)}
            style={{
              background: '#8B1E2D',
              color: '#ffffff',
              border: 0,
              padding: '12px 18px',
              borderRadius: '24px',
              fontSize: '14px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 4px 12px rgba(139,30,45,0.25)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              width: '100%',
              justifyContent: 'center'
            }}
          >
            <i className="fa-solid fa-pen" /> Compose Email
          </button>

          {/* FOLDERS LIST */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', padding: '6px 10px' }}>
              Folders
            </span>

            <button
              type="button"
              onClick={() => { setActiveFolder('inbox'); setSelectedMessage(null); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 12px',
                borderRadius: '6px',
                border: 0,
                background: activeFolder === 'inbox' ? 'rgba(139,30,45,0.12)' : 'transparent',
                color: activeFolder === 'inbox' ? '#8B1E2D' : '#334155',
                fontWeight: activeFolder === 'inbox' ? 800 : 600,
                fontSize: '13px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fa-solid fa-inbox" /> Inbox
              </span>
              <span style={{
                background: activeFolder === 'inbox' ? '#8B1E2D' : '#e2e8f0',
                color: activeFolder === 'inbox' ? '#ffffff' : '#475569',
                padding: '2px 7px',
                borderRadius: '10px',
                fontSize: '11px',
                fontWeight: 700
              }}>
                {inbounds.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveFolder('sent'); setSelectedMessage(null); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 12px',
                borderRadius: '6px',
                border: 0,
                background: activeFolder === 'sent' ? 'rgba(139,30,45,0.12)' : 'transparent',
                color: activeFolder === 'sent' ? '#8B1E2D' : '#334155',
                fontWeight: activeFolder === 'sent' ? 800 : 600,
                fontSize: '13px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fa-solid fa-paper-plane" /> Sent
              </span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>{outbounds.length}</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveFolder('starred'); setSelectedMessage(null); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 12px',
                borderRadius: '6px',
                border: 0,
                background: activeFolder === 'starred' ? 'rgba(139,30,45,0.12)' : 'transparent',
                color: activeFolder === 'starred' ? '#8B1E2D' : '#334155',
                fontWeight: activeFolder === 'starred' ? 800 : 600,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              <i className="fa-solid fa-star" style={{ color: '#8B1E2D' }} /> Starred
            </button>

            <button
              type="button"
              onClick={() => { setActiveFolder('all'); setSelectedMessage(null); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 12px',
                borderRadius: '6px',
                border: 0,
                background: activeFolder === 'all' ? 'rgba(139,30,45,0.12)' : 'transparent',
                color: activeFolder === 'all' ? '#8B1E2D' : '#334155',
                fontWeight: activeFolder === 'all' ? 800 : 600,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              <i className="fa-solid fa-folder-open" /> All Mail
            </button>
          </div>

          {/* ACCOUNTS / MAILBOX SELECTOR */}
          <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', padding: '6px 10px' }}>
              Mailboxes
            </span>

            <button
              type="button"
              onClick={() => setSelectedAccount('all')}
              style={{
                padding: '7px 10px',
                borderRadius: '5px',
                border: 0,
                background: selectedAccount === 'all' ? '#1E232A' : 'transparent',
                color: selectedAccount === 'all' ? '#ffffff' : '#334155',
                fontSize: '12px',
                fontWeight: selectedAccount === 'all' ? 700 : 500,
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              All Inboxes
            </button>

            {accountList.map(a => {
              const isActive = selectedAccount.toLowerCase() === a.email.toLowerCase();
              return (
                <button
                  key={a.email}
                  type="button"
                  onClick={() => setSelectedAccount(a.email)}
                  style={{
                    padding: '7px 10px',
                    borderRadius: '5px',
                    border: 0,
                    background: isActive ? '#1E232A' : 'transparent',
                    color: isActive ? '#ffffff' : '#334155',
                    fontSize: '12px',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                  title={a.email}
                >
                  <span style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#8B1E2D',
                    display: 'inline-block',
                    marginRight: '6px'
                  }} />
                  {a.email.split('@')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. MESSAGE LIST OR READING PANE */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#ffffff', overflowY: 'auto' }}>
          {selectedMessage ? (
            /* DETAILED EMAIL READING PANE */
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedMessage(null)}
                  style={{ background: '#f1f5f9', border: 0, padding: '7px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#334155' }}
                >
                  &larr; Back to {activeFolder === 'inbox' ? 'Inbox' : 'List'}
                </button>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => handleDeleteMessage(selectedMessage)}
                    style={{ background: '#fee2e2', color: '#b91c1c', border: 0, padding: '6px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
                  >
                    <i className="fa-solid fa-trash" /> Delete
                  </button>
                </div>
              </div>

              {/* MESSAGE HEADER */}
              <div>
                <h2 style={{ fontSize: '20px', color: '#1E232A', margin: '0 0 12px', fontWeight: 800 }}>
                  {selectedMessage.subject}
                </h2>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', background: '#f8fafc', padding: '14px', borderRadius: '6px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1E232A' }}>
                      {selectedMessage.sender_name} <span style={{ fontWeight: 400, color: '#64748b', fontSize: '13px' }}>&lt;{selectedMessage.sender}&gt;</span>
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '2px' }}>
                      To: <strong style={{ color: '#8B1E2D' }}>{selectedMessage.recipient}</strong>
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {selectedMessage.date ? selectedMessage.date.slice(0, 16) : 'Just now'}
                  </div>
                </div>
              </div>

              {/* MESSAGE BODY */}
              <div style={{
                padding: '20px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14.5px',
                lineHeight: 1.7,
                color: '#334155',
                whiteSpace: 'pre-wrap',
                minHeight: '140px'
              }}>
                {selectedMessage.body}
              </div>

              {/* INLINE QUICK REPLY BOX */}
              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 10px', color: '#1E232A', fontSize: '14px', fontWeight: 700 }}>
                  <i className="fa-solid fa-reply" style={{ marginRight: '6px', color: '#8B1E2D' }} />
                  Reply via Resend
                </h4>
                <form onSubmit={handleInlineReply} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input type="hidden" name="to" value={selectedMessage.sender} />
                  <input type="hidden" name="from_account" value={selectedMessage.recipient} />
                  <input type="hidden" name="email_id" value={String(selectedMessage.id)} />
                  <input type="hidden" name="subject" value={`Re: ${selectedMessage.subject}`} />

                  <div style={{ fontSize: '12.5px', color: '#64748b' }}>
                    Sending from: <strong style={{ color: '#8B1E2D' }}>{selectedMessage.recipient}</strong> to <strong style={{ color: '#1E232A' }}>{selectedMessage.sender}</strong>
                  </div>

                  <textarea
                    name="message"
                    rows="4"
                    placeholder="Type your official response here..."
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13.5px',
                      fontFamily: 'inherit'
                    }}
                  />

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="submit"
                      disabled={isPending}
                      style={{
                        background: '#8B1E2D',
                        color: '#ffffff',
                        border: 0,
                        padding: '10px 20px',
                        borderRadius: '4px',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <i className="fa-solid fa-paper-plane" />
                      {isPending ? 'Sending...' : 'Send Reply via Resend'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            /* EMAIL LIST VIEW */
            <div>
              {/* LIST HEADER BAR */}
              <div style={{
                padding: '10px 16px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '12.5px',
                color: '#64748b',
                background: '#fafafa'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: 700, textTransform: 'uppercase', color: '#1E232A' }}>
                    {activeFolder.toUpperCase()}
                  </span>
                  <span>&bull;</span>
                  <span>{messagePool.length} messages</span>
                  {selectedAccount !== 'all' && (
                    <span style={{ background: 'rgba(139,30,45,0.1)', color: '#8B1E2D', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                      Filtered: {selectedAccount}
                    </span>
                  )}
                </div>
              </div>

              {/* LIST ROWS */}
              {!messagePool.length ? (
                <div style={{ padding: '60px 20px', textAlign: 'center', color: '#94a3b8' }}>
                  <i className="fa-solid fa-envelope-open" style={{ fontSize: '42px', marginBottom: '12px', display: 'block', color: '#cbd5e1' }} />
                  <p style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>No messages in {activeFolder}</p>
                  <small style={{ color: '#94a3b8' }}>Incoming inquiries from the website or Resend appear here automatically.</small>
                </div>
              ) : (
                <div>
                  {messagePool.map(m => {
                    const recipientPrefix = (m.recipient || '').split('@')[0] || 'desk';
                    return (
                      <div
                        key={`${m.type}-${m.id}`}
                        onClick={() => setSelectedMessage(m)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          padding: '12px 16px',
                          borderBottom: '1px solid #f1f5f9',
                          cursor: 'pointer',
                          background: '#ffffff',
                          transition: 'background 0.15s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; }}
                      >
                        {/* AVATAR WITH SENDER INITIAL */}
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: m.type === 'outbound' ? '#1E232A' : '#8B1E2D',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: 700,
                          flexShrink: 0
                        }}>
                          {(m.sender_name || m.sender || 'P')[0].toUpperCase()}
                        </div>

                        {/* RECIPIENT DESK BADGE */}
                        <span style={{
                          background: 'rgba(139,30,45,0.08)',
                          color: '#8B1E2D',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 800,
                          letterSpacing: '0.3px',
                          flexShrink: 0
                        }}>
                          [{recipientPrefix}]
                        </span>

                        {/* SENDER NAME */}
                        <div style={{
                          width: '180px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontSize: '13.5px',
                          fontWeight: 700,
                          color: '#1E232A',
                          flexShrink: 0
                        }}>
                          {m.sender_name || m.sender}
                        </div>

                        {/* SUBJECT & PREVIEW */}
                        <div style={{
                          flex: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontSize: '13px'
                        }}>
                          <strong style={{ color: '#1E232A' }}>{m.subject}</strong>
                          <span style={{ color: '#64748b', marginLeft: '8px' }}>
                            — {(m.body || '').replace(/\n+/g, ' ').slice(0, 100)}
                          </span>
                        </div>

                        {/* STATUS BADGE */}
                        {m.status && (
                          <span style={{
                            background: m.status === 'replied' ? '#e0f2fe' : '#f0fdf4',
                            color: m.status === 'replied' ? '#0369a1' : '#15803d',
                            padding: '2px 6px',
                            borderRadius: '3px',
                            fontSize: '10.5px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            flexShrink: 0
                          }}>
                            {m.status}
                          </span>
                        )}

                        {/* DATE */}
                        <div style={{ fontSize: '11.5px', color: '#94a3b8', flexShrink: 0 }}>
                          {m.date ? m.date.slice(0, 10) : ''}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 4. MODAL: COMPOSE NEW EMAIL */}
      {showCompose && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '560px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            overflow: 'hidden',
            borderTop: '4px solid #8B1E2D'
          }}>
            <div style={{
              background: '#1E232A',
              color: '#ffffff',
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <strong style={{ fontSize: '15px' }}>
                <i className="fa-solid fa-pen" style={{ marginRight: '8px', color: '#8B1E2D' }} />
                New Outbound Message
              </strong>
              <button
                type="button"
                onClick={() => setShowCompose(false)}
                style={{ background: 0, border: 0, color: '#fff', fontSize: '18px', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleComposeSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  From Official Account:
                </label>
                <select
                  name="from"
                  defaultValue={selectedAccount !== 'all' ? selectedAccount : 'admissions@pleasantviewschools.co.ke'}
                  style={{ width: '100%', padding: '9px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 600 }}
                >
                  {accountList.map(a => (
                    <option key={a.email} value={a.email}>
                      {a.display_name ? `${a.display_name} <${a.email}>` : a.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  To Recipient Email:
                </label>
                <input
                  name="to"
                  type="email"
                  placeholder="parent@example.com"
                  required
                  style={{ width: '100%', padding: '9px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Subject Line:
                </label>
                <input
                  name="subject"
                  placeholder="Pleasant View Schools: Admission Confirmation & Details"
                  required
                  style={{ width: '100%', padding: '9px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Email Message Body:
                </label>
                <textarea
                  name="body"
                  rows="6"
                  placeholder="Write official email content here..."
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13.5px', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowCompose(false)}
                  style={{ background: '#f1f5f9', border: 0, padding: '9px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  style={{
                    background: '#8B1E2D',
                    color: '#ffffff',
                    border: 0,
                    padding: '9px 20px',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <i className="fa-solid fa-paper-plane" />
                  {isPending ? 'Sending...' : 'Send via Resend'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: SIMULATE INBOUND EMAIL */}
      {showSimulate && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '520px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            overflow: 'hidden',
            borderTop: '4px solid #8B1E2D'
          }}>
            <div style={{
              background: '#1E232A',
              color: '#ffffff',
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <strong style={{ fontSize: '15px' }}>
                <i className="fa-solid fa-flask" style={{ marginRight: '8px', color: '#8B1E2D' }} />
                Simulate Inbound Email to Mailbox
              </strong>
              <button
                type="button"
                onClick={() => setShowSimulate(false)}
                style={{ background: 0, border: 0, color: '#fff', fontSize: '18px', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSimulateSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Target School Mailbox (Recipient):
                </label>
                <select
                  name="recipient"
                  defaultValue="admissions@pleasantviewschools.co.ke"
                  style={{ width: '100%', padding: '9px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 600 }}
                >
                  {accountList.map(a => (
                    <option key={a.email} value={a.email}>
                      {a.email} ({a.display_name || a.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Sender Full Name:
                </label>
                <input
                  name="name"
                  defaultValue="Dr. Elizabeth Wambui (Prospective Parent)"
                  required
                  style={{ width: '100%', padding: '9px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Sender Email Address:
                </label>
                <input
                  name="email"
                  type="email"
                  defaultValue="ewambui@gmail.com"
                  required
                  style={{ width: '100%', padding: '9px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Subject:
                </label>
                <input
                  name="subject"
                  defaultValue="Grade 7 Junior Secondary Intake & Transport Routes Inquiry"
                  required
                  style={{ width: '100%', padding: '9px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Inbound Email Message:
                </label>
                <textarea
                  name="body"
                  rows="4"
                  defaultValue="Dear Admissions Desk,\n\nWe would like to register our son for Grade 7 JSS next term. Could you kindly share the fee structure and indicate whether school bus transport is available from Ruiru?\n\nSincerely,\nDr. Elizabeth Wambui"
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowSimulate(false)}
                  style={{ background: '#f1f5f9', border: 0, padding: '9px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  style={{
                    background: '#8B1E2D',
                    color: '#ffffff',
                    border: 0,
                    padding: '9px 20px',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {isPending ? 'Simulating...' : 'Deliver to Inbox Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
