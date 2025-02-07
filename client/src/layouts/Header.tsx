import Logo from "./Logo";
import MenuSmall from "./MenuSmall";

function Header() {
  return (
    <header className="flex items-center justify-between px-4 sm:px-8 h-[5rem] relative bg-primary">
      <Logo />
      <form>
        <div className=" sm:relative hidden md:block ">
          <input
            type="text"
            name="token"
            className="py-2.5 px-5 text-[1.2rem] rounded-full w-[15rem] border-0 placeholder:text-gray-400 focus:outline-none"
            placeholder="Track My Issue #"
          />
          <button className="icon search-icon absolute top-[50%] right-[1%] bg-mainwhite rounded-full translate-y-[-50%] py-2.5 px-5">
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

      <div className="flex items-center justify-center gap-4">
        {/* <div className="icon flex items-center justify-center p-1 bg-mainwhite w-[3rem] h-[3rem] rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="#175af4"
            className="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
            />
          </svg>
        </div> */}
        <div className="flex items-center justify-center gap-4">
          <div className="user-info bg-gradient-to-l from-mainwhite to-white bg-clip-text">
            <h2 className="font-semibold uppercase text-transparent text-[0.8rem] sm:text-[1rem] ">
              john smith
            </h2>
            <p className="uppercase text-right text-[0.6rem] sm:text-[0.8rem] text-transparent">
              student
            </p>
          </div>
          <MenuSmall />
          {/* <div className="w-[3rem] h-[3rem] bg-mainwhite rounded-full"></div> */}
        </div>
      </div>
    </header>
  );
}
export default Header;
