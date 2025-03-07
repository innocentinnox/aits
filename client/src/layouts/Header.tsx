import Logo from "./Logo";
import MenuSmall from "./MenuSmall";
import PopMenu from "./PopMenu";
import SearchHeader from "./SearchHeader";
import UserInfo from "./UserInfo";
import { useState } from "react";

function Header({ user }: { user?: string }) {
  const [popMenuClicked, setIsPopMenuClicked] = useState(false);
  const isUserRegistered = user === "registered";
  function handleMenuClick() {
    setIsPopMenuClicked((value: Boolean) => !value);
  }
  return (
    <header className="flex flex-shrink-0 items-center justify-between px-4 sm:px-8 h-[4rem] relative  bg-zinc-50 col-span-full border-b-2 border-zinc-300  ">
      <Logo />

      {isUserRegistered && (
        <div className="flex gap-2 items-center ">
          <UserInfo />
          <MenuSmall
            onClickMenu={handleMenuClick}
            popMenuClicked={popMenuClicked}
          />
          <PopMenu popMenuClicked={popMenuClicked} />
        </div>
      )}
    </header>
  );
}
export default Header;
