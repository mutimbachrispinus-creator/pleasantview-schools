'use client';
import { useFormStatus } from 'react-dom';
import { useState, useEffect } from 'react';

export default function InlineActionButton({
  label = 'Save',
  pendingLabel = 'Saving...',
  successLabel = '',
  icon = '',
  className = '',
  style = {},
  disabled = false
}) {
  const { pending } = useFormStatus();
  const [wasPending, setWasPending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (pending) {
      setWasPending(true);
      setShowSuccess(false);
    } else if (wasPending) {
      setWasPending(false);
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [pending, wasPending]);

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
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
