import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCurrentUser as updateCurrentUserAPI } from "../../services/apiAuth";
import { useUser } from "./useUser";
import toast from "react-hot-toast";

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const { id, email } = user!;

  if (!email) throw new Error("Email is not found");

  const { mutate: updateCurrentUser, isPending: isUpdating } = useMutation({
    mutationFn: ({
      fullName,
      password,
      avatar,
      newPassword,
    }: {
      fullName?: string;
      password?: string;
      newPassword?: string;
      avatar?: File | undefined | null;
    }) =>
      updateCurrentUserAPI({
        userId: id,
        avatar,
        fullName,
        email,
        password,
        newPassword,
      }),
    onSuccess: () => {
      toast.success("User updated successfully");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { updateCurrentUser, isUpdating };
}
