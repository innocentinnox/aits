import Menu from "./Menu";
import NavBar from "./NavBar";

export default function PopMenu() {
  return (
    <div className=" lg:hidden absolute top-0 right-0 bg-primary">
      <Menu />
    </div>
  );
}
