import Logo from "./Logo";
import Menu from "./Menu";

function NavBar() {
  return (
    <nav className="  hidden h-dvh bg-primary lg:flex flex-col  overflow-scroll noScroll border-t-mainwhite border-t-2   ">
      <Menu />
    </nav>
  );
}
export default NavBar;
