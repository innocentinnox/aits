import React, {
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
  max-height: 90vh;
  overflow-y: auto;
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
interface EnhancedModalContextType {
    openName: string;
    openFromDropdown: (name: string) => void;
    openDirect: (name: string) => void;
    close: () => void;
    isFromDropdown: boolean;
}

const EnhancedModalContext = createContext<EnhancedModalContextType | undefined>(undefined);

// Modal wrapper
function EnhancedModal({ children }: { children: ReactNode }) {
    const [openName, setOpenName] = useState("");
    const [isFromDropdown, setIsFromDropdown] = useState(false);

    const close = () => {
        setOpenName("");
        setIsFromDropdown(false);
    };

    const openFromDropdown = (name: string) => {
        setIsFromDropdown(true);
        // Small delay to allow dropdown to properly register the click
        setTimeout(() => {
            setOpenName(name);
        }, 100);
    };

    const openDirect = (name: string) => {
        setIsFromDropdown(false);
        setOpenName(name);
    };

    return (
        <EnhancedModalContext.Provider value={{
            openName,
            openFromDropdown,
            openDirect,
            close,
            isFromDropdown
        }}>
            {children}
        </EnhancedModalContext.Provider>
    );
}

// Open trigger component for dropdown menu items
function OpenFromDropdown({
    children,
    opens: opensWindowName,
}: {
    children: ReactElement<{ onClick?: MouseEventHandler }>;
    opens: string;
}) {
    const context = useContext(EnhancedModalContext);
    if (!context) throw new Error("OpenFromDropdown must be used within an EnhancedModal");
    const { openFromDropdown } = context;

    return cloneElement(children, {
        onClick: (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            openFromDropdown(opensWindowName);
        },
    });
}

// Open trigger component for direct clicks
function OpenDirect({
    children,
    opens: opensWindowName,
}: {
    children: ReactElement<{ onClick?: MouseEventHandler }>;
    opens: string;
}) {
    const context = useContext(EnhancedModalContext);
    if (!context) throw new Error("OpenDirect must be used within an EnhancedModal");
    const { openDirect } = context;

    return cloneElement(children, {
        onClick: (e) => {
            if (children.props.onClick) {
                children.props.onClick(e);
            }
            openDirect(opensWindowName);
        },
    });
}

// Modal window component
function Window({
    children,
    name,
    overlayStyles,
}: {
    children: ReactElement<{ onCloseModal: () => void }>;
    name: string;
    overlayStyles?: CSSProperties;
}) {
    const context = useContext(EnhancedModalContext);
    if (!context) throw new Error("Window must be used within an EnhancedModal");
    const { openName, close, isFromDropdown } = context;
    const modalRef = useRef<HTMLDivElement>(null);

    // Enhanced click handler that properly handles dropdown-opened modals
    useEffect(() => {
        if (name === openName) {
            function handleClick(e: MouseEvent) {
                const target = e.target as Element;

                // First check: Don't close if clicking inside the modal
                if (modalRef.current && modalRef.current.contains(target)) {
                    return;
                }

                // Second check: Don't close if clicking on form elements or UI components
                const isInteractiveElement =
                    target.closest('input') ||
                    target.closest('textarea') ||
                    target.closest('select') ||
                    target.closest('button') ||
                    target.closest('.form-field') ||
                    target.closest('.modal-content') ||
                    target.closest('.select-content') ||
                    target.closest('.dropdown-content');

                if (isInteractiveElement) {
                    return;
                }

                // Third check: Don't close if clicking on Radix UI components
                const hasActiveRadixComponents = () => {
                    try {
                        // Common Radix selectors
                        const radixSelectors = [
                            '[data-radix-select-content]',
                            '[data-radix-dropdown-menu-content]',
                            '[data-radix-popper]',
                            '[data-radix-portal]',
                            '[data-state="open"]'
                        ];

                        // Check for any active Radix UI components
                        for (const selector of radixSelectors) {
                            const elements = document.querySelectorAll(selector);
                            if (elements.length > 0) return true;
                        }

                        // Check if the clicked element has any radix attributes
                        if (target instanceof Element) {
                            const hasRadixAttr = Array.from(target.attributes).some(attr =>
                                attr.name.startsWith('data-radix')
                            );
                            if (hasRadixAttr) return true;
                        }

                        return false;
                    } catch (error) {
                        console.warn("Error checking for Radix components", error);
                        return false;
                    }
                };

                // If modal was opened from dropdown, be more permissive
                if (isFromDropdown) {
                    // For dropdown-opened modals, don't close when interacting with any UI elements
                    if (hasActiveRadixComponents()) {
                        return;
                    }

                    // Only close if clicking directly on the overlay (the semi-transparent background)
                    if (e.target !== document.querySelector('[data-modal-overlay="true"]')) {
                        return;
                    }
                }

                // Only close if we passed all the protection checks
                close();
            }

            // Add click handler with appropriate delay based on modal type
            const timeoutId = setTimeout(() => {
                document.addEventListener('mousedown', handleClick, { capture: true });
            }, isFromDropdown ? 300 : 200);

            return () => {
                clearTimeout(timeoutId);
                document.removeEventListener('mousedown', handleClick, true);
            };
        }
    }, [name, openName, close, isFromDropdown]);

    if (name !== openName) return null;

    // Professional overlay styles
    const professionalOverlayStyles: CSSProperties = {
        backdropFilter: "blur(8px)",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
    };

    // Combine styles
    const finalOverlayStyles = {
        ...professionalOverlayStyles,
        ...overlayStyles,
    };

    return createPortal(
        <Overlay
            $customStyles={finalOverlayStyles}
            data-modal-overlay="true"
            onClick={(e) => {
                // For dropdown-opened modals, stop event propagation
                if (isFromDropdown) {
                    e.stopPropagation();
                }

                // Only close if clicking directly on the overlay itself
                if (e.target === e.currentTarget) {
                    close();
                }
            }}
        >
            <StyledModal
                ref={modalRef}
                data-modal-content="true"
                className="modal-content"
                onClick={(e) => {
                    // Extra protection for all modals
                    e.stopPropagation();
                }}
            >
                <div className="modal-content">{cloneElement(children, { onCloseModal: close })}</div>
            </StyledModal>
        </Overlay>,
        document.body
    );
}

// Attach components as properties to the main component
EnhancedModal.OpenFromDropdown = OpenFromDropdown;
EnhancedModal.OpenDirect = OpenDirect;
EnhancedModal.Window = Window;

// Export the component with its sub-components
export default EnhancedModal;
