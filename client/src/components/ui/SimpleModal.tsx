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
function SimpleModal({ children }: { children: ReactNode }) {
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
    if (!context) throw new Error("Open must be used within a SimpleModal");
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
    if (!context) throw new Error("Window must be used within a SimpleModal");
    const { openName, close } = context;

    const modalRef = useRef<HTMLDivElement>(null);

    // Simple outside click logic - exactly like Lecturer's dashboard
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            const target = e.target as Element;

            // Don't close if clicking inside the modal
            if (modalRef.current && modalRef.current.contains(target)) {
                return;
            }

            // Don't close if clicking on Select dropdown content (which renders in portal)
            if (
                target.closest('[data-radix-select-content]') ||
                target.closest('[data-radix-select-viewport]') ||
                target.closest('[data-radix-select-item]') ||
                target.closest('[data-radix-select-trigger]') ||
                target.closest('[data-radix-select-value]') ||
                target.closest('[data-radix-select-icon]') ||
                target.closest('[data-radix-popper-content]') ||
                target.closest('[data-radix-portal]')
            ) {
                return;
            }

            // Close the modal
            close();
        }

        if (name === openName) {
            document.addEventListener("click", handleClick, true);
            return () => document.removeEventListener("click", handleClick, true);
        }
    }, [openName, name, close]);

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
                <div>{cloneElement(children, { onCloseModal: close })}</div>
            </StyledModal>
        </Overlay>,
        document.body
    );
}

SimpleModal.Open = Open;
SimpleModal.Window = Window;

export default SimpleModal;
