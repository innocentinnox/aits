import { useEffect, useRef } from "react";

export function useClickOutSide<T extends HTMLElement>(
  handler: () => void,
  isCapturing: boolean = true
) {
  const ref = useRef<HTMLDivElement | null>(null); // Ensuring it's HTMLDivElement

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handler();
      }
    }
    document.addEventListener("click", handleClick, isCapturing);
    return () =>
      document.removeEventListener("click", handleClick, isCapturing);
  }, [isCapturing, handler]);

  return ref;
}
