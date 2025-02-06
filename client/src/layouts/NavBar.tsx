import Logo from "./Logo";
import Menu from "./Menu";

function NavBar() {
  return (
    <nav className="h-dvh bg-primary flex flex-col   col-[span_1/_span_2] row-span-full">
      <Logo />
      <Menu />
    </nav>
  );
}
export default NavBar;
