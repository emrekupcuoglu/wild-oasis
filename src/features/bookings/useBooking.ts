import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getBooking } from "../../services/apiBookings";

export function useBooking() {
  const { bookingId } = useParams();
  if (!bookingId) throw new Error("No booking ID found");
  const {
    data: booking,
    isLoading,
    error,
  } = useQuery({
    // queryKey will uniquely identify the data we are going to query
    // This can be a complex array or it can only be an array with a string
    // We will also see the queryKey in our react-query-devtools. This is what identified each data. So if we use useQuery in another with this key, then the data would be read from the cache
    queryKey: ["booking", bookingId],
    // this is the function for actually querying the data
    // The function that we specify here needs to return a promise
    queryFn: () => getBooking(Number(bookingId)),
    // react-query will try to retry 3 times if there is an error, but here in this case if there is no data it probably won't change even if we retry
    retry: false,
  });

  return { booking, isLoading, error };
}
