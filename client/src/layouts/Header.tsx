import Logo from "./Logo";
import MenuSmall from "./MenuSmall";
import PopMenu from "./PopMenu";
import SearchHeader from "./SearchHeader";
import UserInfo from "./UserInfo";
import { useState } from "react";

function Header() {
  const [popMenuClicked, setIsPopMenuClicked] = useState(false);
  function handleMenuClick() {
    setIsPopMenuClicked((value: Boolean) => !value);
  }
  return (
    <header className="flex items-center justify-between px-4 sm:px-8 h-[5rem] relative bg-primary col-span-full">
      <Logo />
      <SearchHeader />
      <UserInfo />
      <MenuSmall
        onClickMenu={handleMenuClick}
        popMenuClicked={popMenuClicked}
      />
      <PopMenu popMenuClicked={popMenuClicked} />
    </header>
  );
}
export default Header;
