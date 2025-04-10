import { createContext } from "react";

interface IssueContextProps {
  issues: [];
}
const IssuesContext = createContext<IssueContextProps | undefined>(undefined);

export function IssueProvider({ children }) {
  return (
    <IssuesContext.Provider value={{ issues }}>
      {children}
    </IssuesContext.Provider>
  );
}
