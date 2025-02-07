import MenuItem from "./MenuItem";
import MenuIcons from "@/icons/Svg";
const PATHS = [
  "issues",
  "attachments",
  "history",
  "statistics",
  "faqs",
  "about us",
];
export default function Menu() {
  return (
    <ul className="mt-5 flex-col flex ">
      {MenuIcons.map((item, i) => (
        <MenuItem name={`${PATHS[i]}`} icon={item} path={PATHS[i]} />
      ))}
    </ul>
  );
}
