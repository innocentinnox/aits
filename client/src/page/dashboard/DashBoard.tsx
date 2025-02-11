import { Send } from "lucide-react";
import CardGrid from "./CardGrid";
import Table from "./Table/Table";
import Filter from "./Table/Filter/Filter";
import FilterGrid from "./Table/Filter/FilterGrid";

export default function DashBoard() {
  return (
    <>
      <CardGrid />
      <Table />
    </>
  );
}
