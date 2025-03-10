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
        <X className="stroke-current text-zinc-600" size={30} />
      ) : (
        <AlignJustify className="stroke-current text-zinc-600" size={30} />
      )}
    </div>
  );
}
