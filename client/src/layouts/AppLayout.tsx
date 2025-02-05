import MainContent from "./MainContent";
import NavBar from "./NavBar";
import Header from "./Header";
const AppLayout = () => {
  return (
    <div className="grid grid-cols-[0.6fr_auto] overflow-hidden divide-x-2 divide-mainwhite">
      <NavBar />
      <MainContent>
        <Header />
      </MainContent>
    </div>
  );
};

export default AppLayout;
