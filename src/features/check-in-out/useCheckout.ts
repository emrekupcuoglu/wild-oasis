import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useCheckout() {
  const queryClient = useQueryClient();

  const { mutate: checkOut, isPending: isCheckingOut } = useMutation({
    mutationFn: (bookingId: number) =>
      updateBooking(bookingId, {
        status: "checked-out",
      }),
    // onSuccess function receives the data that is returned from the mutationFn function
    onSuccess: (data) => {
      toast.success(`Booking #${data.id} successfully checked-out`);
      queryClient.invalidateQueries({ refetchType: "active" });
    },
    onError: () => toast.error("There was an error while checking-out"),
  });

  return { checkOut, isCheckingOut };
}
