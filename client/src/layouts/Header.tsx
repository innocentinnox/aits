import Logo from "./Logo";
import MenuSmall from "./MenuSmall";
import PopMenu from "./PopMenu";
import SearchHeader from "./SearchHeader";
import UserInfo from "./UserInfo";

function Header() {
  return (
    <header className="flex items-center justify-between px-4 sm:px-8 h-[5rem] relative bg-primary col-span-full">
      <Logo />
      <SearchHeader />
      <UserInfo />
      <MenuSmall />
    </header>
  );
}
export default Header;
