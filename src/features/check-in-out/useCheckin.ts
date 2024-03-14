import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface checkInMutationParams {
  bookingId: number;
  breakfast?: {
    hasBreakfast: boolean;
    extrasPrice: number;
    totalPrice: number;
  };
}
export function useCheckin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: checkIn, isPending: isCheckingIn } = useMutation({
    mutationFn: ({ bookingId, breakfast }: checkInMutationParams) =>
      updateBooking(bookingId, {
        status: "checked-in",
        isPaid: true,
        ...breakfast,
      }),
    // onSuccess function receives the data that is returned from the mutationFn function
    onSuccess: (data) => {
      toast.success(`Booking #${data.id} successfully checked-in`);
      queryClient.invalidateQueries({ refetchType: "active" });
      navigate("/");
    },
    onError: () => toast.error("There was an error while checking-in"),
  });

  return { checkIn, isCheckingIn };
}
