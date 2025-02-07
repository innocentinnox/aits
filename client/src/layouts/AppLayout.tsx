import MainContent from "./MainContent";
import NavBar from "./NavBar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
const AppLayout = () => {
  return (
    // <div className="lg:grid lg:grid-cols-[0.4fr_auto] overflow-hidden divide-x-2 divide-mainwhite">
    <div className="flex flex-col">
      <Header />
      <MainContent>
        <>
          <NavBar />
          <Outlet />
        </>
      </MainContent>
    </div>
  );
};

export default AppLayout;
