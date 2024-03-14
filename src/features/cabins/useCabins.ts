import { useQuery } from "@tanstack/react-query";
import { getCabins } from "../../services/apiCabins";

export function useCabins() {
  const {
    data: cabins,
    isLoading,
    error,
  } = useQuery({
    // queryKey will uniquely identify the data we are going to query
    // This can be a complex array or it can only be an array with a string
    // We will also see the queryKey in our react-query-devtools. This is what identified each data. So if we use useQuery in another with this key, then the data would be read from the cache
    queryKey: ["cabins"],
    // this is the function for actually querying the data
    // The function that we specify here needs to return a promise
    queryFn: getCabins,
  });

  return { cabins, isLoading, error };
}
