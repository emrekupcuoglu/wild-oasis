import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";
import { IBookingFilter } from "../../types";
import { PAGE_SIZE } from "../../utils/constants";

export function useBookings() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  // FILTER

  const filterValue = searchParams.get("status") || "all";
  const filter: IBookingFilter | null =
    !filterValue || filterValue === "all"
      ? null
      : { field: "status", value: filterValue, method: "eq" };

  // SORT
  const sortByRaw = searchParams.get("sortBy") || "startDate-desc";
  const [field, direction] = sortByRaw.split("-");
  const sortBy = { field, direction };

  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  // QUERY
  const {
    data: bookings,
    isLoading,
    error,
  } = useQuery({
    // queryKey will uniquely identify the data we are going to query
    // This can be a complex array or it can only be an array with a string
    // We will also see the queryKey in our react-query-devtools. This is what identified each data. So if we use useQuery in another with this key, then the data would be read from the cache
    // ? Right when we filter the bookings from the API side, the data doesn't get re-fetched, to re-fetch the data we need to add the dependency to the queryKey Array. This works exactly the same way the useEffect dependency array works
    queryKey: ["bookings", filter, sortBy, page],
    // this is the function for actually querying the data
    // The function that we specify here needs to return a promise
    queryFn: () => getBookings({ filter, sortBy, page }),
  });

  // PRE-FETCHING

  if (bookings?.count) {
    const pageCount = Math.ceil(bookings?.count / PAGE_SIZE);

    if (page < pageCount)
      queryClient.prefetchQuery({
        queryKey: ["bookings", filter, sortBy, page + 1],
        queryFn: () => getBookings({ filter, sortBy, page: page + 1 }),
      });
    if (page > 1)
      queryClient.prefetchQuery({
        queryKey: ["bookings", filter, sortBy, page - 1],
        queryFn: () => getBookings({ filter, sortBy, page: page - 1 }),
      });
  }

  return { bookings, isLoading, error };
}
