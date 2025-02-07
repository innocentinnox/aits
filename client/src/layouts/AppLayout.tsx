import MainContent from "./MainContent";
import NavBar from "./NavBar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import PopMenu from "./PopMenu";
const AppLayout = () => {
  return (
    // <div className="lg:grid lg:grid-cols-[0.4fr_auto] overflow-hidden divide-x-2 divide-mainwhite">
    <div className="flex flex-col overflow-hidden h-dvh ">
      <Header />
      <MainContent>
        <div>
          <NavBar />

          <Outlet />
        </div>
      </MainContent>
    </div>
  );
};

export default AppLayout;
