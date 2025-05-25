import { useEffect, useRef, RefObject } from "react";

export function useOutsideClick(
  handler: () => void,
  listenCapturing = true
): RefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        const target = e.target as Element;
        
        // Check if any select dropdown is currently open in the DOM
        const hasOpenSelect = document.querySelector('[data-state="open"][data-radix-select-trigger]') ||
                             document.querySelector('[data-radix-select-content]') ||
                             document.querySelector('[data-state="open"]');
        
        // More comprehensive check for Radix UI and Select elements
        const isSelectRelatedElement = (
          // Direct select content elements
          target.closest('[data-radix-select-content]') ||
          target.closest('[data-radix-select-viewport]') ||
          target.closest('[data-radix-select-item]') ||
          target.closest('[data-radix-select-trigger]') ||
          target.closest('[data-radix-select-value]') ||
          target.closest('[data-radix-select-icon]') ||
          target.closest('[data-radix-select-scroll-up-button]') ||
          target.closest('[data-radix-select-scroll-down-button]') ||
          
          // Popper elements (used by Radix Select)
          target.closest('[data-radix-popper-content]') ||
          target.closest('[data-radix-popper-content-wrapper]') ||
          target.closest('[data-radix-popper-arrow]') ||
          
          // Portal elements
          target.closest('[data-radix-portal]') ||
          
          // Collection elements
          target.closest('[data-radix-collection-item]') ||
          
          // Check for any element with data-state="open"
          target.closest('[data-state="open"]') ||
          
          // Check if target itself has select-related attributes
          target.hasAttribute('data-radix-select-content') ||
          target.hasAttribute('data-radix-select-viewport') ||
          target.hasAttribute('data-radix-popper-content') ||
          target.hasAttribute('data-state') ||
          
          // Check if it's inside any select component structure
          target.closest('button[role="combobox"]') ||
          target.closest('[role="listbox"]') ||
          target.closest('[role="option"]')
        );
        
        // Additional check: prevent closure if clicking on or inside form elements
        const isFormElement = target.closest('form') && (
          target.tagName === 'SELECT' ||
          target.tagName === 'OPTION' ||
          target.closest('select') ||
          target.closest('button[aria-haspopup="listbox"]')
        );
        
        // Don't close modal if:
        // 1. There's an open select dropdown
        // 2. Clicking on select-related elements
        // 3. Clicking on form select elements
        if (!isSelectRelatedElement && !isFormElement && !hasOpenSelect) {
          handler();
        }
      }
    }

    // Add a small delay to allow select state to update
    function delayedHandleClick(e: MouseEvent) {
      setTimeout(() => handleClick(e), 10);
    }

    document.addEventListener("click", delayedHandleClick, listenCapturing);
    return () =>
      document.removeEventListener("click", delayedHandleClick, listenCapturing);
  }, [handler, listenCapturing]);

  return ref;
}
