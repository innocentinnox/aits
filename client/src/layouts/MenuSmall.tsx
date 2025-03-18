import { usePopMenu } from "@/context/usePopMenu";
import { AlignJustify, LayoutList, X } from "lucide-react";
import React, { useEffect } from "react";

export default function MenuSmall() {
  const { isMenuOpen, setIsMenuOpen } = usePopMenu();

  return (
    <div
      className="lg:hidden cursor-pointer"
      onClick={() => {
        setIsMenuOpen((curval: Boolean) => !curval);
      }}
    >
      {isMenuOpen ? (
        <X className="stroke-current text-zinc-600" size={30} />
      ) : (
        <AlignJustify className="stroke-current text-zinc-600" size={30} />
      )}
    </div>
  );
}
