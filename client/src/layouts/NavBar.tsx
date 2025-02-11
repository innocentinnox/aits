import Logo from "./Logo";
import Menu from "./Menu";

function NavBar() {
  return (
    <nav className="  h-[95%] bg-primary   overflow-scroll noScroll border-t-mainwhite border-t-2 hidden lg:block  ">
      <Menu />
    </nav>
  );
}
export default NavBar;
