export default function MenuItem({
  name,
  icon,
  accord,
}: {
  name: string;
  icon: JSX.Element;
  accord: number;
}) {
  return (
    <li className="flex items-center gap-2 py-3 pl-6 pr-4 text-slate-200 hover:bg-mainwhite hover:text-secondary">
      <span>{icon}</span>
      <span className="text-[1rem] capitalize text-semibold"> {name}</span>
      {accord === 0 && (
        <span className="ml-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-[1rem] h-[1rem]"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </span>
      )}
    </li>
  );
}
