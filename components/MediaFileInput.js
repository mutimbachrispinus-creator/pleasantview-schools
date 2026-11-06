'use client';
import { useState, useRef, useEffect } from 'react';
import { uploadMediaFile } from '@/lib/adminClient';

export default function MediaFileInput({
  name,
  accept = 'image/*',
  type = 'image',
  maxSizeMB = 100,
  label = '',
  helpText = '',
  required = false
}) {
  const effectiveMaxMB = type === 'video' ? Math.max(maxSizeMB, 100) : Math.max(maxSizeMB, 50);
  const [fileInfo, setFileInfo] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const uploadSeqRef = useRef(0);

  useEffect(() => {
    const el = wrapperRef.current;
    const form = el?.closest('form');
    if (!form) return;

    const handleFormReset = () => {
      uploadSeqRef.current += 1;
      setFileInfo(null);
      setUploadedUrl('');
      setIsUploading(false);
      setProgress(0);
      setError('');
      if (el) {
        el.__uploadPromise = null;
        delete el.dataset.uploadedUrl;
        delete el.dataset.uploadError;
      }
    };

    form.addEventListener('reset', handleFormReset);
    return () => form.removeEventListener('reset', handleFormReset);
  }, []);

  const handleFileChange = (e) => {
    setError('');
    setUploadedUrl('');
    setProgress(0);

    const wrapperEl = wrapperRef.current;
    if (wrapperEl) {
      wrapperEl.__uploadPromise = null;
      delete wrapperEl.dataset.uploadedUrl;
      delete wrapperEl.dataset.uploadError;
    }

    const file = e.target.files?.[0];
    if (!file) {
      setFileInfo(null);
      setIsUploading(false);
      return;
    }

    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > effectiveMaxMB) {
      const msg = `Selected file (${sizeMB.toFixed(1)} MB) exceeds the ${effectiveMaxMB} MB limit.${type === 'video' ? ' Please compress the video or paste a YouTube link.' : ''}`;
      setError(msg);
      if (wrapperEl) wrapperEl.dataset.uploadError = msg;
      if (inputRef.current) inputRef.current.value = '';
      setFileInfo(null);
      return;
    }

    let previewUrl = '';
    if (type === 'image' && typeof URL !== 'undefined') {
      try {
        previewUrl = URL.createObjectURL(file);
      } catch {}
    }

    setFileInfo({
      name: file.name,
      sizeMB: sizeMB < 0.1 ? '< 0.1' : sizeMB.toFixed(1),
      previewUrl
    });

    const seq = ++uploadSeqRef.current;
    setIsUploading(true);
    setProgress(5);

    const promise = uploadMediaFile(file, {
      type,
      onProgress: (pct) => {
        if (uploadSeqRef.current === seq) {
          setProgress(pct);
        }
      }
    }).then((res) => {
      if (uploadSeqRef.current !== seq) return res;
      setIsUploading(false);

      if (res?.ok && res?.url) {
        setUploadedUrl(res.url);
        setProgress(100);
        if (wrapperRef.current) {
          wrapperRef.current.dataset.uploadedUrl = res.url;
          delete wrapperRef.current.dataset.uploadError;
          wrapperRef.current.__uploadPromise = null;
        }
        // Clear raw File binary from input so form submission stays tiny (< 4 KB)
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      } else {
        const errMsg = res?.error || 'Upload failed. Please re-select the file and try again.';
        setError(errMsg);
        if (wrapperRef.current) {
          wrapperRef.current.dataset.uploadError = errMsg;
          wrapperRef.current.__uploadPromise = null;
        }
      }
      return res;
    });

    if (wrapperEl) {
      wrapperEl.__uploadPromise = promise;
    }
  };

  const handleClear = () => {
    uploadSeqRef.current += 1;
    if (inputRef.current) inputRef.current.value = '';
    setFileInfo(null);
    setUploadedUrl('');
    setIsUploading(false);
    setProgress(0);
    setError('');
    if (wrapperRef.current) {
      wrapperRef.current.__uploadPromise = null;
      delete wrapperRef.current.dataset.uploadedUrl;
      delete wrapperRef.current.dataset.uploadError;
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="form-group media-file-input"
      data-field-name={name}
      data-uploading={isUploading ? 'true' : 'false'}
      style={{ marginBottom: '12px' }}
    >
      {label && <label>{label}{required ? ' *' : ''}</label>}
      <input type="hidden" name={`${name}_uploaded_url`} value={uploadedUrl} />

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        required={required && !uploadedUrl && !isUploading}
        onChange={handleFileChange}
        style={{
          display: 'block',
          width: '100%',
          padding: '8px 10px',
          border: error ? '1.5px solid #ef4444' : uploadedUrl ? '1.5px solid #22c55e' : '1px solid #d1d5db',
          borderRadius: '4px',
          fontSize: '13px',
          background: '#ffffff',
          boxSizing: 'border-box'
        }}
      />

      {helpText && !error && (
        <small style={{ color: '#666', fontSize: '11px', display: 'block', marginTop: '4px' }}>
          {helpText}
        </small>
      )}

      {error && (
        <div style={{
          marginTop: '6px',
          background: '#fef2f2',
          color: '#b91c1c',
          border: '1px solid #fecaca',
          borderRadius: '4px',
          padding: '6px 10px',
          fontSize: '12px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <i className="fa-solid fa-circle-exclamation" />
          <span>{error}</span>
        </div>
      )}

      {fileInfo && !error && (
        <div style={{
          marginTop: '8px',
          background: uploadedUrl ? '#f0fdf4' : '#eff6ff',
          border: `1px solid ${uploadedUrl ? '#bbf7d0' : '#bfdbfe'}`,
          borderRadius: '6px',
          padding: '8px 12px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            {fileInfo.previewUrl && (
              <img
                src={fileInfo.previewUrl}
                alt="Selected preview"
                style={{
                  width: '48px',
                  height: '48px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  border: `1px solid ${uploadedUrl ? '#86efac' : '#93c5fd'}`
                }}
              />
            )}
            <div style={{ flex: 1, minWidth: 0, fontSize: '12px', color: uploadedUrl ? '#166534' : '#1e40af' }}>
              <div style={{ fontWeight: 700, wordBreak: 'break-all' }}>
                <i className={type === 'video' ? 'fa-solid fa-video' : 'fa-solid fa-image'} style={{ marginRight: '6px' }} />
                {fileInfo.name}
              </div>
              <div style={{ color: uploadedUrl ? '#15803d' : '#1d4ed8', fontSize: '11px', marginTop: '2px', fontWeight: 600 }}>
                {isUploading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '5px' }} />
                    Uploading to cloud storage... {progress}% ({fileInfo.sizeMB} MB)
                  </>
                ) : uploadedUrl ? (
                  <>
                    <i className="fa-solid fa-circle-check" style={{ marginRight: '5px' }} />
                    Uploaded &amp; verified ({fileInfo.sizeMB} MB) — click Publish/Save below
                  </>
                ) : (
                  `Selected (${fileInfo.sizeMB} MB)`
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={handleClear}
              style={{
                background: '#fee2e2',
                color: '#991b1b',
                border: '1px solid #fecaca',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Clear
            </button>
          </div>

          {isUploading && (
            <div style={{
              marginTop: '7px',
              height: '5px',
              width: '100%',
              background: '#dbeafe',
              borderRadius: '999px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${progress}%`,
                background: '#2563eb',
                transition: 'width 0.2s ease'
              }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
