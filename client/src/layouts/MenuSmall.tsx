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
      className="lg:hidden cursor-pointer"
      onClick={() => {
        onClickMenu();
      }}
    >
      {popMenuClicked ? (
        <X color="#f9fcff" size={30} />
      ) : (
        <AlignJustify color="#f9fcff" size={30} />
      )}
    </div>
  );
}
