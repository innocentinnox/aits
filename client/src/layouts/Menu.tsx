import MenuItem from "./MenuItem";
import MenuIcons from "@/icons/Svg";
import { PATHS } from "../icons/Svg";
export default function Menu() {
  return (
    <ul className="mt-5 flex-col flex  ">
      {MenuIcons.map((item, i) => (
        <MenuItem
          name={`${PATHS[i]}`}
          icon={item}
          path={PATHS[i]}
          key={PATHS[i]}
        />
      ))}
    </ul>
  );
}
