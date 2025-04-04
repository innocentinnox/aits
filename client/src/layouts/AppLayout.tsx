import MainContent from "./MainContent";
import NavBar from "./NavBar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="grid grid-cols-[13rem_1fr] grid-rows-[auto_1fr] overflow-hidden h-dvh ">
      <Header user="registered" />
      <NavBar />
      <MainContent>
        <Outlet />
      </MainContent>
    </div>
  );
};

export default AppLayout;
