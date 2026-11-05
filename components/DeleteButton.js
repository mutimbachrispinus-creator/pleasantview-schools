'use client';
import { useFormStatus } from 'react-dom';

export default function DeleteButton({
  confirmMessage = 'Are you sure you want to delete this record?',
  children = 'Delete',
  style = {}
}) {
  const { pending } = useFormStatus();

  return (
    <button
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

