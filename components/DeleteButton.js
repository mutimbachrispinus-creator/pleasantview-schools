'use client';

export default function DeleteButton({
  confirmMessage = 'Are you sure you want to delete this record?',
  children = 'Delete',
  style = {}
}) {
  return (
    <button
      type="submit"
      style={style}
      onClick={(e) => {
        if (typeof window !== 'undefined' && !window.confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}
