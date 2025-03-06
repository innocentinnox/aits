export default function UserInfo() {
  return (
    <div className="flex items-center justify-between gap-4 ">
      <div className="user-info text-zinc-600">
        <h2 className="font-semibold uppercase text-[0.8rem] sm:text-[1rem] ">
          john smith whales
        </h2>
        <p className="uppercase text-right text-[0.6rem] sm:text-[0.8rem]">
          student(COCIS)
        </p>
      </div>
      <div className="w-[2.8rem] h-[2.8rem] bg-primary rounded-full"></div>
    </div>
  );
}
