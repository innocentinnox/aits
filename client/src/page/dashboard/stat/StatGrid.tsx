import Heading from "@/components/ui/Heading";
import AreaChartComp from "./AreaChartComp";
import PieChartComp from "./PieChartComp";

function StatGrid() {
  return (
    <>
      <Heading as="h2" className="text-center">
        Issues Statistics
      </Heading>
      <div className="flex flex-col sm:gap-0 sm:flex-row justify-between  p-4 items-center">
        <PieChartComp />
        <AreaChartComp />
      </div>
    </>
  );
}

export default StatGrid;
