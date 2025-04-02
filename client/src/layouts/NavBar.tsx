import Logo from "./Logo";
import Menu from "./Menu";

function NavBar() {
  return (
    <nav className=" bg-zinc-50  overflow-scroll noScroll  hidden lg:block border-r-2 border-zinc-200 ">
      <Menu setIsMenuOpen={undefined} />
    </nav>
  );
}
export default NavBar;
