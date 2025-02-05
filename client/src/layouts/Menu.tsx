import MenuItem from "./MenuItem";

export default function Menu() {
  return (
    <ul className="mt-5 overflow-scroll noScroll">
      {Array.from({ length: 10 }, (_, i) => (
        <MenuItem name="Issues" key={i} />
      ))}
    </ul>
  );
}
