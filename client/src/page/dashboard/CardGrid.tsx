import { Loader, Send, SquareCheckBig } from "lucide-react";
import CardItem from "./CardItem";
import { formatCurrency } from "@/utilities/helper";
const CARDS = ["submitted", "in progress", "resolved"];
const SVGS = [<Send />, <Loader />, <SquareCheckBig />];
export default function CardGrid() {
  return (
    <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row justify-around  p-4 pt-0 items-center">
      {CARDS.map((card, index) => (
        <CardItem
          title={card}
          icon={SVGS[index]}
          value={formatCurrency(2536673)}
          key={card}
        />
      ))}
    </div>
  );
}
