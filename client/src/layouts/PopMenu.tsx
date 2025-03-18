import { usePopMenu } from "@/context/usePopMenu";
import Menu from "./Menu";
import { useEffect, useRef } from "react";

export default function PopMenu() {
  const { isMenuOpen, setIsMenuOpen } = usePopMenu();
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function handleClickOutside(e: any) {
      if (ref.current && !ref.current.contains(e.target) && isMenuOpen) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside, true);
    return () =>
      document.removeEventListener("click", handleClickOutside, true);
  }, [isMenuOpen]);
  return (
    <div
      ref={ref}
      className={`${
        isMenuOpen
          ? " opacity-100 translate-x-[0%] "
          : " opacity-0 translate-x-[100%] "
      }    lg:hidden absolute top-[100%] noScroll right-0 bg-white shadow-lg z-[1000]  overflow-y-scroll h-fit  transition-all duration-400 ease-in-out   `}
    >
      <Menu setIsMenuOpen={setIsMenuOpen} />
    </div>
  );
}
