import MainContent from "./MainContent";
import NavBar from "./NavBar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
const AppLayout = () => {
  return (
    <div className="grid grid-cols-[0.6fr_auto] overflow-hidden divide-x-2 divide-mainwhite">
      <NavBar />
      <MainContent>
        <>
          <Header />
          <Outlet />
        </>
      </MainContent>
    </div>
  );
};

export default AppLayout;
