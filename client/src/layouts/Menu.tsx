import MenuItem from "./MenuItem";
import MenuIcons from "@/icons/Svg";
const PATHS = [
  "issues",
  "track",
  "attachments",
  "history",
  "statistics",
  "faqs",
  "about us",
];
export default function Menu() {
  return (
    <ul className="mt-5 overflow-scroll noScroll  ">
      {MenuIcons.map((item, i) => (
        <MenuItem name={`${PATHS[i]}`} icon={item} path={PATHS[i]} />
      ))}
    </ul>
  );
}
