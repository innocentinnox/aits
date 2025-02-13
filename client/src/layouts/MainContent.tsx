import PopMenu from "./PopMenu";

function MainContent({ children }: { children: any }) {
  return (
    <main className=" flex flex-col overflow-scroll p-2 overflow-x-hidden h-[100%] relative   row-start-2 col-start-1 col-end-3 lg:col-start-2">
      {children}
    </main>
  );
}
export default MainContent;
