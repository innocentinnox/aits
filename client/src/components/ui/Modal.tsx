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
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { X } from "lucide-react";
import { useAuth } from "@/auth";

// Styled components
const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  transition: all 0.5s;
  z-index: 1001;
`;

const Overlay = styled.div<{ $customStyles?: CSSProperties }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--backdrop-color, rgba(0, 0, 0, 0.3));
  backdrop-filter: blur(4px);
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
  const { openName, close } = context;

  // Create a custom ref that doesn't use the outside click hook by default
  const modalRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Use a modified outside click detection
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Element;

      // Don't close if clicking inside the modal
      if (modalRef.current && modalRef.current.contains(target)) {
        return;
      }

      // Don't close if there's any open select dropdown
      const hasOpenSelect = document.querySelector('[data-state="open"][data-radix-select-trigger]') ||
        document.querySelector('[data-radix-select-content]');

      if (hasOpenSelect) {
        return;
      }

      // Don't close if clicking on select-related elements
      const isSelectElement = target.closest('[data-radix-select-content]') ||
        target.closest('[data-radix-select-viewport]') ||
        target.closest('[data-radix-select-item]') ||
        target.closest('[data-radix-select-trigger]') ||
        target.closest('[data-radix-popper-content]') ||
        target.closest('[data-radix-portal]') ||
        target.closest('[data-state="open"]');

      if (!isSelectElement) {
        close();
      }
    }

    if (name === openName) {
      // Use capture phase to catch events before they reach other handlers
      document.addEventListener('mousedown', handleClick, true);
      return () => document.removeEventListener('mousedown', handleClick, true);
    }
  }, [name, openName, close]);

  // Apply stronger blur for student dashboard
  const studentBlurStyles: CSSProperties =
    user?.role === "student"
      ? { backdropFilter: "blur(8px)", backgroundColor: "rgba(0, 0, 0, 0.5)" }
      : {};

  // Combine custom styles with student-specific styles
  const finalOverlayStyles = user?.role === "student"
    ? { ...studentBlurStyles, ...overlayStyles }
    : overlayStyles;

  if (name !== openName) return null;

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
