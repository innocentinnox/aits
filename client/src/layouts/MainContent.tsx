import PopMenu from "./PopMenu";

function MainContent({ children }: { children: any }) {
  return (
    <main className="lg:grid h-dvh md:grid-cols-[15rem_auto] overflow-hidden divide-x-2 divide-mainwhite relative">
      {children}
      <PopMenu />
    </main>
  );
}
export default MainContent;
