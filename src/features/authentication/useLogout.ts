import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout as logoutAPI } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    mutate: logout,
    isPending: isLoggingOut,
    error: logoutError,
  } = useMutation({
    mutationFn: logoutAPI,
    onSuccess: () => {
      queryClient.removeQueries();
      navigate("/login", { replace: true });
    },
  });

  return { logout, isLoggingOut, logoutError };
}
