import { Send } from "lucide-react";
import Card from "./CardItem";
import CardGrid from "./CardGrid";
import Table from "./Table/Table";

export default function DashBoard() {
  return (
    <div className="flex flex-col overflow-scroll p-4 h-[90%]">
      <CardGrid />
      <Table />
    </div>
  );
}
