import { Send } from "lucide-react";
import Card from "./CardItem";
import CardGrid from "./CardGrid";
import Table from "./Table/Table";

export default function DashBoard() {
  return (
    <div className="flex flex-col overflow-scroll p-2 h-[95%] overflow-x-hidden">
      <CardGrid />

      <Table />
    </div>
  );
}
