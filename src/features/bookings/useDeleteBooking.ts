import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBooking as deleteBookingAPI } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useDeleteBooking() {
  const queryClient = useQueryClient();
  const { mutate: deleteBooking, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => deleteBookingAPI(id),
    onSuccess: (data) => {
      toast.success(`Successfully deleted the booking ${data.id}`);
      queryClient.invalidateQueries({ refetchType: "active" });
    },
    onError: () => toast.error("Failed to delete "),
  });

  return { deleteBooking, isDeleting };
}
