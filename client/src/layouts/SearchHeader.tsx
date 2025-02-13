import { Search } from "lucide-react";

export default function SearchHeader() {
  return (
    <form>
      <div className=" sm:relative hidden md:block ">
        <input
          type="text"
          name="token"
          className="py-2 px-3 text-[1rem] rounded-full w-[15rem] border-0 placeholder:text-gray-400 focus:outline-none"
          placeholder="Track My Issue #"
        />
        <button className="icon search-icon absolute top-[50%] right-[1%] bg-mainwhite rounded-full translate-y-[-50%] py-[0.5rem] px-[0.5rem]">
          <Search color="#334eac" />
        </button>
      </div>
    </form>
  );
}
