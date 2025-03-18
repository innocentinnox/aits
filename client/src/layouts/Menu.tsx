import MenuItem from "./MenuItem";
import MenuIcons from "@/icons/Svg";
import { PATHS } from "../icons/Svg";
import { PopMenuProvider } from "@/context/usePopMenu";
export default function Menu({ setIsMenuOpen }: { setIsMenuOpen: any }) {
  return (
    <ul className="mt-5 flex-col flex  ">
      {MenuIcons.map((item, i) => (
        <MenuItem
          name={`${PATHS[i]}`}
          icon={item}
          path={PATHS[i]}
          key={PATHS[i]}
          setIsMenuOpen={setIsMenuOpen}
        />
      ))}
    </ul>
  );
}
