'use client';
import { useFormStatus } from 'react-dom';
import { useState, useEffect, useRef } from 'react';

export default function DeleteButton({
  confirmMessage = 'Are you sure you want to delete this record?',
  children = 'Delete',
  style = {}
}) {
  const { pending: nativePending } = useFormStatus();
  const [apiPending, setApiPending] = useState(false);
  const btnRef = useRef(null);

  useEffect(() => {
    const form = btnRef.current?.closest('form');
    if (!form) return;

    const onStart = () => setApiPending(true);
    const onDone = () => setApiPending(false);

    form.addEventListener('pvs:form-start', onStart);
    form.addEventListener('pvs:form-success', onDone);
    form.addEventListener('pvs:form-error', onDone);

    return () => {
      form.removeEventListener('pvs:form-start', onStart);
      form.removeEventListener('pvs:form-success', onDone);
      form.removeEventListener('pvs:form-error', onDone);
    };
  }, []);

  const pending = nativePending || apiPending;

  return (
    <button
      ref={btnRef}
      type="submit"
      disabled={pending}
      style={{
        ...style,
        opacity: pending ? 0.6 : 1,
        cursor: pending ? 'not-allowed' : 'pointer'
      }}
      onClick={(e) => {
        if (typeof window !== 'undefined' && !window.confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
    >
      {pending ? (
        <>
          <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '4px' }} />
          Deleting...
        </>
      ) : (
        children
      )}
    </button>
  );
}
