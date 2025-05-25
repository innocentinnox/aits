import {
  cloneElement,
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
  ReactElement,
  MouseEventHandler,
  CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { X } from "lucide-react";

// Styled components
const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: transparent;
  border-radius: 0.75rem;
  transition: all 0.5s;
  z-index: 1001;
`;

const Overlay = styled.div<{ $customStyles?: CSSProperties }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  z-index: 1000;
  transition: all 0.5s;
  
  /* Apply custom styles if provided */
  ${(props) => props.$customStyles && { ...props.$customStyles }}
`;

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: 0.375rem;
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;

  &:hover {
    background-color: #f3f4f6;
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: #6b7280;
  }
`;

// Context types
interface ModalContextType {
  openName: string;
  open: (name: string) => void;
  close: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Modal wrapper
function Modal({ children }: { children: ReactNode }) {
  const [openName, setOpenName] = useState("");

  const close = () => setOpenName("");
  const open = setOpenName;

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}

// Open trigger component
function Open({
  children,
  opens: opensWindowName,
}: {
  children: ReactElement<{ onClick?: MouseEventHandler }>;
  opens: string;
}) {
  const context = useContext(ModalContext);
  if (!context) throw new Error("Open must be used within a Modal");
  const { open } = context;

  return cloneElement(children, {
    onClick: () => open(opensWindowName),
  });
}

// Modal window
function Window({
  children,
  name,
  overlayStyles,
}: {
  children: ReactElement<{ onCloseModal: () => void }>;
  name: string;
  overlayStyles?: CSSProperties;
}) {
  const context = useContext(ModalContext);
  if (!context) throw new Error("Window must be used within a Modal");
  const { openName, close } = context;  // Create a custom ref that doesn't use the outside click hook by default
  const modalRef = useRef<HTMLDivElement>(null);

  // Enhanced outside click detection with better Radix UI integration
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Element;

      // Don't close if clicking inside the modal
      if (modalRef.current && modalRef.current.contains(target)) {
        return;
      }

      // Don't close if clicking on form elements (additional protection)
      if (
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('select') ||
        target.closest('button') ||
        target.closest('.form-field') ||
        target.closest('.select-content') ||
        target.closest('.dropdown-content')
      ) {
        return;
      }      // Check for any active Radix UI components that should prevent modal closing
      const hasActiveRadixComponents = () => {
        try {
          // Check for open select dropdowns
          const openSelects = document.querySelectorAll('[data-state="open"][data-radix-select-trigger]');
          if (openSelects.length > 0) return true;

          // Check for any visible select content
          const selectContent = document.querySelectorAll('[data-radix-select-content]');
          if (selectContent.length > 0) return true;

          // Check for open dropdown menus
          const openDropdowns = document.querySelectorAll('[data-state="open"][data-radix-dropdown-menu-trigger]');
          if (openDropdowns.length > 0) return true;

          // Check for any visible dropdown content
          const dropdownContent = document.querySelectorAll('[data-radix-dropdown-menu-content]');
          if (dropdownContent.length > 0) return true;

          // Check for any Radix poppers (for Select, DropdownMenu, etc.)
          const poppers = document.querySelectorAll('[data-radix-popper]');
          if (poppers.length > 0) return true;

          // Check for any Radix portals
          const portals = document.querySelectorAll('[data-radix-portal]');
          if (portals.length > 0) return true;

          return false;
        } catch (error) {
          console.warn("Error checking for Radix components:", error);
          return false;
        }
      };

      // Don't close if any Radix components are active
      if (hasActiveRadixComponents()) {
        return;
      }

      // Comprehensive list of elements that should not trigger modal close
      const protectedSelectors = [
        // Radix Select components (all variations)
        '[data-radix-select-content]',
        '[data-radix-select-viewport]',
        '[data-radix-select-item]',
        '[data-radix-select-trigger]',
        '[data-radix-select-value]',
        '[data-radix-select-icon]',
        '[data-radix-select-scroll-up-button]',
        '[data-radix-select-scroll-down-button]',
        '[role="option"]',
        '[role="listbox"]',

        // Radix Dropdown Menu components (all variations)
        '[data-radix-dropdown-menu-content]',
        '[data-radix-dropdown-menu-item]',
        '[data-radix-dropdown-menu-trigger]',
        '[data-radix-dropdown-menu-portal]',
        '[data-radix-dropdown-menu-viewport]',
        '[data-radix-dropdown-menu-label]',
        '[data-radix-dropdown-menu-separator]',

        // Radix Popper and Portal components
        '[data-radix-popper-content]',
        '[data-radix-portal]',
        '[data-radix-focus-scope]',
        '[data-radix-dismissable-layer]',

        // General Radix state selectors
        '[data-state="open"]',
        '[data-state="checked"]',
        '[data-highlighted]',

        // Form elements that should not close modal
        'textarea',
        'input[type="text"]',
        'input[type="email"]',
        'input[type="password"]',
        'input[type="number"]',
        'select',
        'button[type="submit"]',
        'button[type="button"]',
        'button[role="option"]',

        // ARIA and role-based selectors
        '[role="dialog"]',
        '[role="menu"]',
        '[role="menuitem"]',
        '[role="button"]',
        '[aria-expanded="true"]',

        // Custom classes for modal content protection
        '.modal-content',
        '.select-content',
        '.dropdown-content',
        '.modal-form',
        '.form-field'
      ];

      // Check if click target or any parent matches protected selectors
      const isProtectedElement = protectedSelectors.some(selector => {
        try {
          // Check if target itself matches
          if (target.matches && target.matches(selector)) return true;
          // Check if any parent matches
          return target.closest(selector) !== null;
        } catch (error) {
          // Handle invalid selectors gracefully
          console.warn(`Invalid selector: ${selector}`, error);
          return false;
        }
      });

      // Don't close modal if clicking on protected elements
      if (isProtectedElement) {
        return;
      }      // Additional check: if the target has any data-radix attributes, protect it
      if (target instanceof Element && (
        Array.from(target.attributes).some(attr => attr.name.startsWith('data-radix')) ||
        target.closest('[data-radix-select-content]') ||
        target.closest('[data-radix-dropdown-menu-content]')
      )) {
        return;
      }

      // Close modal only if clicking outside all protected areas
      close();
    }

    if (name === openName) {
      // Longer delay to ensure all Radix UI interactions are properly handled
      const timeoutId = setTimeout(() => {
        // Use capture phase to intercept events before they reach Radix handlers
        document.addEventListener('mousedown', handleClick, { capture: true, passive: false });
      }, 200);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClick, true);
      };
    }
  }, [name, openName, close]);
  if (name !== openName) return null;

  // Apply professional blur and backdrop for all roles
  const professionalOverlayStyles: CSSProperties = {
    backdropFilter: "blur(8px)",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 9999,
  };

  // Combine professional styles with any custom overlay styles
  const finalOverlayStyles = {
    ...professionalOverlayStyles,
    ...overlayStyles,
  };

  return createPortal(
    <Overlay $customStyles={finalOverlayStyles}>
      <StyledModal ref={modalRef}>
        {/* <Button onClick={close}>
          <X />
        </Button> */}
        <div>{cloneElement(children, { onCloseModal: close })}</div>
      </StyledModal>
    </Overlay>,
    document.body
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
