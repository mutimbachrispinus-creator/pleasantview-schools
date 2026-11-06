'use client';
import { useFormStatus } from 'react-dom';
import { useState, useEffect, useRef } from 'react';

export default function InlineActionButton({
  label = 'Save',
  pendingLabel = 'Saving...',
  successLabel = '',
  icon = '',
  className = '',
  style = {},
  disabled = false
}) {
  const { pending: nativePending } = useFormStatus();
  const [apiPending, setApiPending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    const form = el?.closest('form');
    if (!form) return;

    let timer;
    const onStart = () => {
      if (timer) clearTimeout(timer);
      setApiPending(true);
      setShowSuccess(false);
    };
    const onSuccess = () => {
      setApiPending(false);
      setShowSuccess(true);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setShowSuccess(false), 3000);
    };
    const onError = () => {
      setApiPending(false);
      setShowSuccess(false);
    };

    form.addEventListener('pvs:form-start', onStart);
    form.addEventListener('pvs:form-success', onSuccess);
    form.addEventListener('pvs:form-error', onError);

    return () => {
      form.removeEventListener('pvs:form-start', onStart);
      form.removeEventListener('pvs:form-success', onSuccess);
      form.removeEventListener('pvs:form-error', onError);
      if (timer) clearTimeout(timer);
    };
  }, []);

  const pending = nativePending || apiPending;

  return (
    <span ref={rootRef} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <button
        type="submit"
        disabled={disabled || pending}
        className={className}
        style={{
          ...style,
          opacity: pending ? 0.7 : 1,
          cursor: pending ? 'not-allowed' : 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '5px'
        }}
      >
        {pending ? (
          <>
            <i className="fa-solid fa-spinner fa-spin" />
            <span>{pendingLabel}</span>
          </>
        ) : (
          <>
            {icon && <i className={icon} />}
            <span>{label}</span>
          </>
        )}
      </button>
      {showSuccess && successLabel && (
        <span
          style={{
            fontSize: '11px',
            color: '#15803d',
            background: '#f0fdf4',
            border: '1px solid #86efac',
            padding: '2px 6px',
            borderRadius: '4px',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px'
          }}
        >
          <i className="fa-solid fa-check" />
          {successLabel}
        </span>
      )}
    </span>
  );
}
