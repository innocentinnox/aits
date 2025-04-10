import Heading from "@/components/ui/Heading";
import StatGrid from "./StatGrid";
import CardGrid from "../../page/dashboard/CardGrid";

function Statistics() {
  return (
    <>
      <Heading as="h3" className="text-center">
        Issues Statistics
      </Heading>
      <CardGrid />
      <StatGrid />
    </>
  );
}

export default Statistics;
