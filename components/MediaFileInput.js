'use client';
import { useState, useRef } from 'react';

export default function MediaFileInput({
  name,
  accept = 'image/*',
  type = 'image',
  maxSizeMB = 15,
  label = '',
  helpText = '',
  required = false
}) {
  const [fileInfo, setFileInfo] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    setError('');
    const file = e.target.files?.[0];
    if (!file) {
      setFileInfo(null);
      return;
    }

    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      setError(`⚠️ Selected file (${sizeMB.toFixed(1)}MB) exceeds the ${maxSizeMB}MB limit. Please compress the file${type === 'video' ? ' or use a YouTube link' : ''}.`);
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
      sizeMB: sizeMB.toFixed(1),
      previewUrl
    });
  };

  const handleClear = () => {
    if (inputRef.current) inputRef.current.value = '';
    setFileInfo(null);
    setError('');
  };

  return (
    <div className="form-group media-file-input" style={{ marginBottom: '12px' }}>
      {label && <label>{label}{required ? ' *' : ''}</label>}
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept={accept}
        required={required}
        onChange={handleFileChange}
        style={{
          display: 'block',
          width: '100%',
          padding: '8px 10px',
          border: error ? '1.5px solid #ef4444' : '1px solid #d1d5db',
          borderRadius: '4px',
          fontSize: '13px',
          background: '#ffffff'
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
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '6px',
          padding: '8px 12px',
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
                border: '1px solid #86efac'
              }}
            />
          )}
          <div style={{ flex: 1, minWidth: 0, fontSize: '12px', color: '#166534' }}>
            <div style={{ fontWeight: 700, wordBreak: 'break-all' }}>
              <i className={type === 'video' ? 'fa-solid fa-video' : 'fa-solid fa-image'} style={{ marginRight: '6px' }} />
              {fileInfo.name}
            </div>
            <div style={{ color: '#15803d', fontSize: '11px' }}>
              Ready for upload ({fileInfo.sizeMB} MB)
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
      )}
    </div>
  );
}
