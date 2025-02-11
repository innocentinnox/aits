import MainContent from "./MainContent";
import NavBar from "./NavBar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    // <div className="lg:grid lg:grid-cols-[0.4fr_auto] overflow-hidden divide-x-2 divide-mainwhite">
    <div className="grid grid-cols-[15rem_1fr] grid-rows-[auto_1fr] overflow-hidden h-dvh ">
      <Header />
      <NavBar />
      <MainContent>
        <Outlet />
      </MainContent>
    </div>
  );
};

export default AppLayout;
