import { createContext, useContext, useState } from "react";

interface PopContextProps {
  isMenuOpen: Boolean;
  setIsMenuOpen: Function;
}
const PopMenuContext = createContext<PopContextProps | undefined>(undefined);

export function PopMenuProvider({ children }: { children: any }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <PopMenuContext.Provider value={{ isMenuOpen, setIsMenuOpen }}>
      {children}
    </PopMenuContext.Provider>
  );
}

export function usePopMenu() {
  const context = useContext(PopMenuContext);
  if (context === undefined) throw new Error("The Context is undefined");
  return context;
}
