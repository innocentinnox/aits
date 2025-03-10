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
      }    lg:hidden absolute top-[100%] noScroll right-0 bg-white shadow-lg z-[1000]  overflow-y-scroll h-fit  transition-all duration-400 ease-in-out   `}
    >
      <Menu />
    </div>
  );
}
