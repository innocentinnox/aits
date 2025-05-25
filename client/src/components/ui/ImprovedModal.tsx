import React, { createContext, useContext, useState, useEffect, ReactNode, ReactElement, MouseEventHandler, CSSProperties } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

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

// Context types
interface ModalContextType {
    openModal: string;
    openModalFromDropdown: (name: string) => void;
    openModalDirect: (name: string) => void;
    close: () => void;
    isFromDropdown: boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Modal wrapper
function ImprovedModal({ children }: { children: ReactNode }) {
    const [openModal, setOpenModal] = useState("");
    const [isFromDropdown, setIsFromDropdown] = useState(false);

    const close = () => {
        setOpenModal("");
        setIsFromDropdown(false);
    };

    const openModalFromDropdown = (name: string) => {
        setIsFromDropdown(true);
        // Small delay to allow dropdown to properly register the click
        setTimeout(() => {
            setOpenModal(name);
        }, 100);
    };

    const openModalDirect = (name: string) => {
        setIsFromDropdown(false);
        setOpenModal(name);
    };

    return (
        <ModalContext.Provider value={{ openModal, openModalFromDropdown, openModalDirect, close, isFromDropdown }}>
            {children}
        </ModalContext.Provider>
    );
}

// Open trigger component for dropdown items
function OpenFromDropdown({
    children,
    opens: opensWindowName,
}: {
    children: ReactElement<{ onClick?: MouseEventHandler }>;
    opens: string;
}) {
    const context = useContext(ModalContext);
    if (!context) throw new Error("OpenFromDropdown must be used within an ImprovedModal");
    const { openModalFromDropdown } = context;

    return React.cloneElement(children, {
        onClick: (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            openModalFromDropdown(opensWindowName);
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
    const context = useContext(ModalContext);
    if (!context) throw new Error("OpenDirect must be used within an ImprovedModal");
    const { openModalDirect } = context;

    return React.cloneElement(children, {
        onClick: () => openModalDirect(opensWindowName),
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
    if (!context) throw new Error("Window must be used within an ImprovedModal");
    const { openModal, close, isFromDropdown } = context;

    useEffect(() => {
        if (name === openModal) {
            function handleClick(e: MouseEvent) {
                const target = e.target as Element;

                // Prevent closing if clicking on form elements or dropdown components
                if (
                    target.closest('input') ||
                    target.closest('textarea') ||
                    target.closest('select') ||
                    target.closest('button') ||
                    target.closest('[class*="dropdown"]') ||
                    target.closest('[class*="select"]') ||
                    target.closest('[data-radix]') ||
                    target.closest('.form-field') ||
                    target.closest('.modal-content') ||
                    target.closest('.select-content')
                ) {
                    return;
                }

                // If modal was opened from dropdown, be more permissive with clicks
                if (isFromDropdown) {
                    // Only close if clicking directly on the overlay (not on modal content)
                    if (e.target === e.currentTarget) {
                        close();
                    }
                    return;
                }

                // For direct opens, use normal outside click behavior
                const modalContent = document.querySelector('[data-modal-content="true"]');
                if (modalContent && !modalContent.contains(target)) {
                    close();
                }
            }

            // Only add click listener if not from dropdown or after a delay for dropdown
            if (!isFromDropdown) {
                document.addEventListener('mousedown', handleClick, true);
            } else {
                // For dropdown-opened modals, add listener after longer delay
                const timeoutId = setTimeout(() => {
                    document.addEventListener('mousedown', handleClick, true);
                }, 500);

                return () => {
                    clearTimeout(timeoutId);
                    document.removeEventListener('mousedown', handleClick, true);
                };
            }

            return () => {
                document.removeEventListener('mousedown', handleClick, true);
            };
        }
    }, [name, openModal, close, isFromDropdown]);

    // Handle Escape key
    useEffect(() => {
        if (name === openModal) {
            const handleEscape = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    close();
                }
            };

            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [name, openModal, close]);

    if (name !== openModal) return null;

    // Professional overlay styles
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
        <Overlay
            $customStyles={finalOverlayStyles}
            onClick={(e) => {
                // Prevent event propagation completely for dropdown-opened modals
                if (isFromDropdown) {
                    e.stopPropagation();
                }

                // Only close if clicking directly on the overlay itself
                if (e.target === e.currentTarget) {
                    // For dropdown-opened modals, only close when explicitly clicking on overlay
                    // and not when interacting with any elements inside the modal
                    if (!isFromDropdown || (isFromDropdown && e.target === document.querySelector('.overlay'))) {
                        close();
                    }
                }
            }}
        >
            <StyledModal
                data-modal-content="true"
                className="modal-content"
                onClick={(e) => {
                    // Extra protection for dropdown-opened modals
                    if (isFromDropdown) {
                        e.stopPropagation();
                    }
                }}
            >
                <div className="modal-content">{React.cloneElement(children, { onCloseModal: close })}</div>
            </StyledModal>
        </Overlay>,
        document.body
    );
}

ImprovedModal.OpenFromDropdown = OpenFromDropdown;
ImprovedModal.OpenDirect = OpenDirect;
ImprovedModal.Window = Window;

export default ImprovedModal;
