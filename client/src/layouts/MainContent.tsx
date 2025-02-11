import PopMenu from "./PopMenu";

function MainContent({ children }: { children: any }) {
  return (
    <main className=" divide-x-2 divide-mainwhite relative h-dvh row-start-2 col-start-1 col-end-3 lg:col-start-2">
      {children}
      <PopMenu />
    </main>
  );
}
export default MainContent;
