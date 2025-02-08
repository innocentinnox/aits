import { Send } from "lucide-react";
import Card from "./CardItem";
import CardGrid from "./CardGrid";

export default function DashBoard() {
  return (
    <div className="flex flex-col overflow-scroll p-4">
      <CardGrid />;
    </div>
  );
}
