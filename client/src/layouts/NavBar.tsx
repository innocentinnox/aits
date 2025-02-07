import Logo from "./Logo";
import Menu from "./Menu";

function NavBar() {
  return (
    <nav className="  hidden h-dvh bg-primary lg:flex flex-col   col-[span_1/_span_2] row-span-full">
      <Menu />
    </nav>
  );
}
export default NavBar;
