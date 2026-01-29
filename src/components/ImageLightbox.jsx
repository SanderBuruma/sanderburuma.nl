import { useEffect } from 'react';

export default function ImageLightbox({ src, alt, isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="image-lightbox-overlay" onClick={onClose}>
      <img
        src={src}
        alt={alt || ''}
        className="image-lightbox-img"
        onClick={(e) => e.stopPropagation()}
      />
      {alt && <p className="image-lightbox-caption">{alt}</p>}
    </div>
  );
}
