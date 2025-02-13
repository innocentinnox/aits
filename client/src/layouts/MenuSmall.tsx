import { AlignJustify, X } from "lucide-react";
import React from "react";

export default function MenuSmall({
  onClickMenu,
  popMenuClicked,
}: {
  onClickMenu: Function;
  popMenuClicked: Boolean;
}) {
  return (
    <div
      onClick={() => {
        onClickMenu();
      }}
    >
      {popMenuClicked ? (
        <X color="#f9fcff" size={30} className="lg:hidden cursor-pointer" />
      ) : (
        <AlignJustify
          color="#f9fcff"
          size={30}
          className="lg:hidden cursor-pointer"
        />
      )}
    </div>
  );
}
