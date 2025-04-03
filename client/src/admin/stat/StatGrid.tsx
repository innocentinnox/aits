import AreaChartComp from "./AreaChartComp";
import PieChartComp from "./PieChartComp";

function StatGrid() {
  return (
    <>
      <div className="sm:grid lg:grid-cols-2  grid-rows-2 items-center ">
        <div className=" self-center">
          <PieChartComp />
        </div>
        <AreaChartComp />
      </div>
    </>
  );
}

export default StatGrid;
