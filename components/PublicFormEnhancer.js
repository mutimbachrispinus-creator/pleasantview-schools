'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PublicFormEnhancer() {
  const router = useRouter();

  useEffect(() => {
    const onSubmit = async (e) => {
      const form = e.target;
      if (!(form instanceof HTMLFormElement)) return;
      if (!form.hasAttribute('data-public-action')) return;
      if (form.dataset.submitting === '1') {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      form.dataset.submitting = '1';

      const btn = form.querySelector('button[type="submit"]');
      const originalHtml = btn ? btn.innerHTML : '';
      if (btn) {
        btn.disabled = true;
        btn.style.opacity = '0.8';
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="margin-right:8px"></i> Submitting...';
      }

      const prevBanner = form.querySelector('[data-public-feedback]');
      if (prevBanner) prevBanner.remove();

      try {
        const fd = new FormData(form);
        const res = await fetch(form.action, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: fd
        });
        const payload = await res.json().catch(() => null);

        if (!res.ok || !payload || payload.ok === false) {
          const errMsg = payload?.error || 'Unable to submit right now. Please check your connection and try again.';
          const errDiv = document.createElement('div');
          errDiv.setAttribute('data-public-feedback', 'error');
          errDiv.style.cssText = 'margin-top:12px;padding:12px 14px;border-radius:6px;background:#fef2f2;border:1px solid #fecaca;color:#991b1b;font-size:13.5px;font-weight:600;';
          errDiv.textContent = errMsg;
          form.appendChild(errDiv);
          return;
        }

        form.reset();
        const okDiv = document.createElement('div');
        okDiv.setAttribute('data-public-feedback', 'ok');
        okDiv.style.cssText = 'margin-top:12px;padding:14px 16px;border-radius:6px;background:#f0fdf4;border:1px solid #86efac;color:#166534;font-size:14px;font-weight:700;';
        okDiv.textContent = payload.message || 'Submitted successfully! Our admissions team has received your details.';
        form.appendChild(okDiv);

        if (payload.redirectTo) {
          router.push(payload.redirectTo);
          router.refresh();
        }
      } catch {
        // Fallback to native HTML POST if fetch encountered a transient network interruption
        form.dataset.submitting = '0';
        form.removeAttribute('data-public-action');
        form.submit();
        return;
      } finally {
        form.dataset.submitting = '0';
        if (btn) {
          btn.disabled = false;
          btn.style.opacity = '1';
          btn.innerHTML = originalHtml;
        }
      }
    };

    document.addEventListener('submit', onSubmit);
    return () => document.removeEventListener('submit', onSubmit);
  }, [router]);

  return null;
}
