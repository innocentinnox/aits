import styled from "styled-components";
import { useClickOutSide } from "../../hooks/useClickOutSide";
import {
  cloneElement,
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  transition: all 0.5s;
`;
const StyledSpan = styled.span`
  width: fit-content;
`;
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
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

interface ModalContextProps {
  open: (windowName: string) => void;
  close: () => void;
  openWindow: string;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

interface ModalProps {
  children: ReactNode;
}

function Modal({ children }: ModalProps) {
  const [openWindow, setOpenWindow] = useState<string>("");
  const open = (windowName: string) => setOpenWindow(windowName);
  const close = () => setOpenWindow("");

  return (
    <ModalContext.Provider value={{ open, close, openWindow }}>
      {children}
    </ModalContext.Provider>
  );
}

interface OpensProps {
  children: ReactNode;
  windowName: string;
}

function Opens({ children, windowName }: OpensProps) {
  const context = useContext(ModalContext);
  if (!context) throw new Error("Opens must be used within a Modal provider");
  const { open } = context;

  return cloneElement(<StyledSpan>{children}</StyledSpan>, {
    onClick: () => open(windowName),
  });
}

interface WindowProps {
  children: ReactNode;
  name: string;
}

function Window({ children, name }: WindowProps) {
  const context = useContext(ModalContext);
  if (!context) throw new Error("Window must be used within a Modal provider");
  const { openWindow, close } = context;
  const ref = useClickOutSide(close);

  if (name !== openWindow) return null;

  return createPortal(
    <Overlay>
      <StyledModal ref={ref}>
        <Button onClick={close}>
          <X size={30} />
        </Button>
        <div>{cloneElement(children as React.ReactElement, { close })}</div>
      </StyledModal>
    </Overlay>,
    document.body
  );
}

Modal.Opens = Opens;
Modal.Window = Window;
export default Modal;
