import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login as loginAPI } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface loginParams {
  email: string;
  password: string;
}
export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    mutate: login,
    isPending: isLoggingIn,
    error: loginError,
  } = useMutation({
    mutationFn: ({ email, password }: loginParams) =>
      loginAPI({ email, password }),
    onSuccess: (user) => {
      // We will add the user to the react query cache manually, because when we login we are automatically redirected to the /dashboard page, and we do not need to run the the getUser function. (getUser is inside the apiAuth and we are calling it in the useUser hook with userMutation )
      // ! We also need to do this because if we are not authorized we navigate back to the login page, and in the getCurrentUser function, if we do not have any session stored in the localStorage we return null
      //  const { data: session } = await supabase.auth.getSession();
      //  if (!session.session) return null;
      //  and because we do not have a session at the time of login, we navigate to the /dashboard but isAuthenticated is false because the user data is null and we navigate back to the login page immediately. We can go to the dashboard if we refresh the page or use the url bar, but it is a really bad UX and it looks as if we are not logged in.
      // ! But if we do this we set the user query manually and we set it to the value returned from the loginAPI function, and with this the isAuthenticated is set to true
      queryClient.setQueryData(["user"], user);

      navigate("/dashboard", { replace: true });
    },

    onError: (err) => {
      console.error(err);
      toast.error("Provided email or password are incorrect");
    },
  });

  return { login, isLoggingIn, loginError };
}
