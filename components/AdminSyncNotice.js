'use client';
import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { callAdminAction, uploadMediaFile } from '@/lib/adminClient';

export default function AdminSyncNotice() {
  const [notice, setNotice] = useState(null);
  const [, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    let hideTimer;

    const showNotice = (next, autoHideMs = 0) => {
      if (hideTimer) clearTimeout(hideTimer);
      setNotice(next);
      if (autoHideMs > 0) {
        hideTimer = setTimeout(() => setNotice(null), autoHideMs);
      }
    };

    const handleFormSubmit = async (e) => {
      const form = e.target;
      if (!form || form.tagName?.toLowerCase() !== 'form') return;

      const actionName = form.getAttribute('data-admin-action');
      if (!actionName) return;

      e.preventDefault();
      if (form.dataset.submitting === 'true') return;

      form.dataset.submitting = 'true';
      form.dispatchEvent(new CustomEvent('pvs:form-start'));

      try {
        // 1. Check MediaFileInput wrappers inside this form
        const mediaWrappers = Array.from(form.querySelectorAll('.media-file-input'));
        for (const wrapper of mediaWrappers) {
          if (wrapper.dataset.uploadError) {
            throw new Error(wrapper.dataset.uploadError);
          }
          if (wrapper.__uploadPromise) {
            showNotice({
              type: 'saving',
              text: 'Finishing media upload to cloud storage before publishing...'
            });
            const upRes = await wrapper.__uploadPromise;
            if (!upRes?.ok) {
              throw new Error(upRes?.error || 'Media upload could not be completed. Please re-select the file.');
            }
          }
        }

        // 2. Fallback: if any raw <input type="file" name="..."> still holds an un-uploaded File
        const rawFileInputs = Array.from(form.querySelectorAll('input[type="file"][name]'));
        const extraUploaded = {};
        for (const fileInput of rawFileInputs) {
          if (fileInput.files && fileInput.files.length > 0) {
            showNotice({
              type: 'saving',
              text: 'Uploading selected media file...'
            });
            const urls = [];
            const names = [];
            for (const f of Array.from(fileInput.files)) {
              const isVid = String(f.type || '').startsWith('video/');
              const upRes = await uploadMediaFile(f, { type: isVid ? 'video' : 'image' });
              if (!upRes?.ok || !upRes?.url) {
                throw new Error(upRes?.error || 'Failed to upload selected media file.');
              }
              urls.push(upRes.url);
              names.push(f.name || '');
            }
            extraUploaded[`${fileInput.name}_uploaded_url`] = urls.length === 1 ? urls[0] : urls;
            extraUploaded[`${fileInput.name}_uploaded_name`] = names.length === 1 ? names[0] : names;
          }
        }

        showNotice({
          type: 'saving',
          text: 'Saving changes to database and synchronizing live with public website...'
        });

        const fd = new FormData(form);

        // Ensure uploaded URLs from MediaFileInput wrappers are always populated even before React state flushes
        for (const wrapper of mediaWrappers) {
          const fieldName = wrapper.getAttribute('data-field-name');
          const url = wrapper.dataset.uploadedUrl;
          const upName = wrapper.dataset.uploadedName;
          if (fieldName && url) {
            fd.set(`${fieldName}_uploaded_url`, url);
          }
          if (fieldName && upName) {
            fd.set(`${fieldName}_uploaded_name`, upName);
          }
        }
        for (const [k, v] of Object.entries(extraUploaded)) {
          if (Array.isArray(v)) {
            fd.delete(k);
            v.forEach(item => fd.append(k, item));
          } else {
            fd.set(k, v);
          }
        }

        // Preserve explicit '0' for unchecked named checkboxes
        const checkboxes = Array.from(form.querySelectorAll('input[type="checkbox"][name]'));
        for (const cb of checkboxes) {
          if (!cb.checked && !fd.has(cb.name)) {
            fd.set(cb.name, '0');
          }
        }

        const res = await callAdminAction(actionName, fd);
        if (!res || res.ok === false) {
          throw new Error(res?.error || 'Portal operation could not be saved. Please verify your inputs and try again.');
        }

        form.dataset.submitting = 'false';
        form.dispatchEvent(new CustomEvent('pvs:form-success', { detail: res }));

        if (form.getAttribute('data-reset-on-save') === 'true') {
          form.reset();
        }

        showNotice(
          {
            type: 'success',
            text: res.message || 'Saved & synchronized live across the website!'
          },
          4500
        );

        startTransition(() => {
          router.refresh();
        });
      } catch (err) {
        form.dataset.submitting = 'false';
        form.dispatchEvent(new CustomEvent('pvs:form-error', { detail: { error: err?.message } }));
        showNotice(
          {
            type: 'error',
            text: err?.message || 'Operation could not be completed. Please try again.'
          },
          7500
        );
      }
    };

    window.addEventListener('submit', handleFormSubmit);
    return () => {
      window.removeEventListener('submit', handleFormSubmit);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [router]);

  if (!notice) return null;

  const isSuccess = notice.type === 'success';
  const isSaving = notice.type === 'saving';
  const isError = notice.type === 'error';

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 99999,
      background: isSuccess ? '#166534' : isError ? '#991b1b' : '#1E232A',
      color: '#ffffff',
      padding: '14px 20px',
      borderRadius: '8px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '13.5px',
      fontWeight: 600,
      border: `1.5px solid ${isSuccess ? '#22c55e' : isError ? '#f87171' : 'var(--gold-accent, #e0a82e)'}`,
      maxWidth: 'min(440px, calc(100vw - 32px))',
      animation: 'slideInRight 0.3s ease-out'
    }}>
      <i
        className={isSaving ? 'fa-solid fa-spinner fa-spin' : isSuccess ? 'fa-solid fa-circle-check' : 'fa-solid fa-triangle-exclamation'}
        style={{ fontSize: '18px', color: isSuccess ? '#4ade80' : isError ? '#fca5a5' : '#fbbf24' }}
      />
      <div style={{ flex: 1, lineHeight: 1.4 }}>{notice.text}</div>
      <button
        type="button"
        onClick={() => setNotice(null)}
        style={{
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.7)',
          cursor: 'pointer',
          padding: '2px 4px',
          marginLeft: '8px',
          fontSize: '16px'
        }}
      >
        <i className="fa-solid fa-xmark" />
      </button>
    </div>
  );
}
