import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCabin as deleteCabinAPI } from "../../services/apiCabins";
import toast from "react-hot-toast";

export function useDeleteCabin() {
  const queryClient = useQueryClient();

  const { mutate: deleteCabin, isPending: isDeleting } = useMutation({
    mutationFn: ({
      id,
      imageName,
    }: {
      id: number;
      imageName: string | undefined;
    }) => deleteCabinAPI(id, imageName),
    onSuccess: () => {
      toast.success("Cabin successfully deleted");
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { deleteCabin, isDeleting };
}
