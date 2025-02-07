function MainContent({ children }: { children: JSX.Element }) {
  return (
    <main className="lg:grid lg:grid-cols-[0.3fr_auto] xl:grid-cols-[0.2fr_auto] overflow-hidden divide-x-2 divide-mainwhite">
      {children}
    </main>
  );
}
export default MainContent;
