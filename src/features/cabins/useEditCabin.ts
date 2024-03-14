import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ICabin, ICabinSupabaseUploadData } from "../../types";
import { createEditCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";

export function useEditCabin() {
  const queryClient = useQueryClient();

  const { mutate: editCabin, isPending: isEditing } = useMutation({
    mutationFn: ({
      newCabinData,
      id,
      curImg,
    }: {
      newCabinData: ICabin | ICabinSupabaseUploadData;
      id: number;
      curImg: string;
    }) => createEditCabin(newCabinData, id, curImg),
    onSuccess: () => {
      toast.success("Cabin successfully updated");
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    },
  });

  return { isEditing, editCabin };
}
