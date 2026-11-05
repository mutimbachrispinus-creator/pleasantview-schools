'use client';
import { useFormStatus } from 'react-dom';

export default function FormSubmitButton({
  label = 'Save Changes',
  pendingLabel = 'Saving & Syncing Live...',
  icon = 'fa-solid fa-floppy-disk',
  variant = 'primary',
  style = {}
}) {
  const { pending } = useFormStatus();

  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';

  const defaultBackground = isDanger
    ? '#dc2626'
    : isPrimary
    ? 'linear-gradient(135deg, #8B1E2D 0%, #6D1421 100%)'
    : '#1E232A';

  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        background: pending ? '#64748b' : defaultBackground,
        color: '#ffffff',
        border: 'none',
        padding: '11px 18px',
        borderRadius: '6px',
        fontSize: '13.5px',
        fontWeight: 700,
        letterSpacing: '0.3px',
        cursor: pending ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        boxShadow: pending ? 'none' : '0 2px 8px rgba(0,0,0,0.12)',
        transition: 'all 0.2s ease',
        ...style
      }}
    >
      <i className={pending ? 'fa-solid fa-spinner fa-spin' : icon} />
      <span>{pending ? pendingLabel : label}</span>
    </button>
  );
}
