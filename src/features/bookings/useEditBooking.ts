import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import { IBookingForm } from "../../types";
import toast from "react-hot-toast";

export function useEditBooking() {
  const queryClient = useQueryClient();
  const {
    mutate: editBooking,
    isPending: isEditing,
    error,
  } = useMutation({
    mutationFn: ({
      id,
      newBookingData,
    }: {
      id: number;
      newBookingData: IBookingForm;
    }) => updateBooking(id, newBookingData),
    onSuccess: (booking) => {
      toast.success(`Booking ${booking.id} successfully updated`);
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: () => toast.error("Failed to update the booking"),
  });

  return { editBooking, isEditing, error };
}
