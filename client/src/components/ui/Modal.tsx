import {
  cloneElement,
  createContext,
  useContext,
  useState,
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
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
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
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-500);
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
  const ref = useOutsideClick(close);
  const { user } = useAuth();

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
      <StyledModal ref={ref}>
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
