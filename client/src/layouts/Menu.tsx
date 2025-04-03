import {
  STUDENT_PATHS,
  STUDENT_ICONS,
  ADMIN_ICONS,
  ADMIN_PATHS,
} from "../icons/Svg";
import { PopMenuProvider } from "@/context/usePopMenu";
import MenuItem from "./MenuItem";
export default function Menu({
  setIsMenuOpen,
  role,
}: {
  setIsMenuOpen: any;
  role: string;
}) {
  // Check for user role
  if (true)
    return (
      <ul className="mt-5 flex-col flex  ">
        {ADMIN_ICONS.map((icon, index) => (
          <MenuItem
            name={`${ADMIN_PATHS[index]}`}
            icon={icon}
            path={"admin" + "/" + ADMIN_PATHS[index]}
            key={ADMIN_PATHS[index]}
            setIsMenuOpen={setIsMenuOpen}
          />
        ))}
      </ul>
    );
  return (
    <ul className="mt-5 flex-col flex  ">
      {STUDENT_ICONS.map((icon, index) => (
        <MenuItem
          name={`${STUDENT_PATHS[index]}`}
          icon={icon}
          path={STUDENT_PATHS[index]}
          key={STUDENT_PATHS[index]}
          setIsMenuOpen={setIsMenuOpen}
        />
      ))}
    </ul>
  );
}
