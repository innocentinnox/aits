import { Loader, Send, SquareCheckBig } from "lucide-react";
import CardItem from "./CardItem";
import { formatCurrency } from "@/utilities/helper";
const CARDS = ["submitted", "in progress", "resolved"];
const SVGS = [<Send />, <Loader />, <SquareCheckBig />];
export default function CardGrid() {
  return (
    <div className="flex justify-around mt-5 p-4">
      {CARDS.map((card, index) => (
        <CardItem
          title={CARDS[index]}
          icon={SVGS[index]}
          value={formatCurrency(2536673)}
        />
      ))}
    </div>
  );
}
