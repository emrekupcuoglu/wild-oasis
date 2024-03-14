import {
  HiOutlineBanknotes,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
} from "react-icons/hi2";
import { IBooking } from "../../types";
import Stat from "./Stat";
import { formatCurrency } from "../../utils/helpers";

interface StatsProps {
  bookings: {
    created_at: string;
    totalPrice: number | null;
    extrasPrice: number | null;
  }[];
  confirmedStays: IBooking[];
  numDays: number;
  cabinCount: number;
}
function Stats({ bookings, confirmedStays, numDays, cabinCount }: StatsProps) {
  const numBookings = bookings.length;

  const sales = bookings.reduce((acc, cur) => {
    return cur.totalPrice ? acc + cur.totalPrice : acc;
  }, 0);

  const checkIns = confirmedStays.length;

  // num of checked in nights / all available nights (number of days * number of cabins )
  const occupancyRate =
    confirmedStays.reduce(
      (acc, cur) => (cur?.numNights ? acc + cur.numNights : acc),
      0
    ) /
    (numDays * cabinCount);
  return (
    <>
      <Stat
        title="bookings"
        color="blue"
        icon={<HiOutlineBriefcase />}
        value={numBookings}
      />
      <Stat
        title="Sales"
        color="green"
        icon={<HiOutlineBanknotes />}
        value={formatCurrency(sales)}
      />
      <Stat
        title="Check-ins"
        color="indigo"
        icon={<HiOutlineCalendarDays />}
        value={checkIns}
      />
      <Stat
        title="Occupancy rates"
        color="yellow"
        icon={<HiOutlineChartBar />}
        value={Math.round(occupancyRate * 100) + "%"}
      />
    </>
  );
}

export default Stats;
