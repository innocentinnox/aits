import AreaChartComp from "./AreaChartComp";
import PieChartComp from "./PieChartComp";

function StatGrid() {
  return (
    <>
      <div className="flex flex-col sm:gap-0 sm:flex-row justify-between  p-4 pt-0 items-center">
        <PieChartComp />
        <AreaChartComp />
      </div>
    </>
  );
}

export default StatGrid;
