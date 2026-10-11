import { useEffect } from 'react';

// Keep keyboard navigation inside the dialog and return to its trigger.
export function useDialog(isOpen, onClose, ref) {
  useEffect(() => {
    if (!isOpen) return;
    const trigger = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const selector = 'a[href], button:not([disabled]), input, select, textarea, [tabindex="0"]';
    const focusable = () => [...(ref.current?.querySelectorAll(selector) || [])].filter(el => el.getClientRects().length);
    focusable()[0]?.focus({ preventScroll: true });
    const handleKey = (event) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); }
      if (event.key === 'Tab') {
        const items = focusable();
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && (document.activeElement === first || !ref.current?.contains(document.activeElement))) {
          event.preventDefault(); last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first?.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKey);
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [isOpen, onClose, ref]);
}
