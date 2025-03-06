import { Search } from "lucide-react";

export default function SearchHeader() {
  return (
    <form>
      <div className=" relative sm:block ">
        <input
          type="text"
          name="token"
          className="py-2 px-3 text-[1rem] rounded-full border-2 border-zinc-500 w-[15rem]  placeholder:text-gray-600 focus:outline-2 focus:outline-primary"
          placeholder="Track My Issue #"
        />
        <button className="icon search-icon absolute top-[50%] right-[1%]  translate-y-[-50%] py-[0.5rem] px-[0.5rem]">
          <Search className="stroke-current text-zinc-600" />
        </button>
      </div>
    </form>
  );
}
