import Menu from "./Menu";

export default function PopMenu() {
  return (
    <div className=" lg:hidden absolute top-0 [100%] right-0 bg-primary">
      <Menu />
    </div>
  );
}
