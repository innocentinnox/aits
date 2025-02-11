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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="#7693ee"
            className="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button>
      </div>
    </form>
  );
}
