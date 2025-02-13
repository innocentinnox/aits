import Menu from "./Menu";

export default function PopMenu({
  popMenuClicked,
}: {
  popMenuClicked: Boolean;
}) {
  return (
    <div
      className={`${
        popMenuClicked
          ? " opacity-100 translate-x-[0%] "
          : " opacity-0 translate-x-[100%] "
      }    lg:hidden absolute top-[100%] noScroll right-0 bg-primary z-[1000] overflow-y-scroll h-[520%] transition-all duration-400 ease-in-out   `}
    >
      <Menu />
    </div>
  );
}
