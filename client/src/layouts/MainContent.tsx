import PopMenu from "./PopMenu";

function MainContent({ children }: { children: JSX.Element }) {
  return (
    <main className="lg:grid h-dvh md:grid-cols-[0.2fr_auto] overflow-hidden divide-x-2 divide-mainwhite relative">
      {children}
      <PopMenu />
    </main>
  );
}
export default MainContent;
