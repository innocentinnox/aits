import { ADMIN_NAV_ITEMS, STUDENT_NAV_ITEMS } from "../icons/Svg";
import { PopMenuProvider } from "@/context/usePopMenu";
import MenuItem from "./MenuItem";
import { useAuth } from "@/auth";
export default function Menu({
  setIsMenuOpen,
  role,
}: {
  setIsMenuOpen: any;
  role: string;
}) {
  const { user } = useAuth();
  // Check for user role
  if (user?.role === "department_head")
    return (
      <ul className="mt-5 flex-col flex  ">
        {ADMIN_NAV_ITEMS.map(({ path, name, icon }, index) => (
          <MenuItem
            name={name}
            icon={icon}
            path={path}
            key={name}
            setIsMenuOpen={setIsMenuOpen}
          />
        ))}
      </ul>
    );
  return (
    <ul className="mt-5 flex-col flex  ">
      {STUDENT_NAV_ITEMS.map(({ path, name, icon }, index) => (
        <MenuItem
          name={name}
          icon={icon}
          path={path}
          key={name}
          setIsMenuOpen={setIsMenuOpen}
        />
      ))}
    </ul>
  );
}
