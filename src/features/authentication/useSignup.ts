import { useMutation } from "@tanstack/react-query";
import { signUp as signUpAPI, signUpParams } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useSignup() {
  const {
    mutate: signUp,
    isPending: isSigningUp,
    error: signUpError,
  } = useMutation({
    mutationFn: ({ fullName, email, password }: signUpParams) =>
      signUpAPI({ email, fullName, password }),
    onSuccess: (user) => {
      console.log(user);
      toast.success(
        "Account successfully create! Please verify the new account from the user's email address."
      );
    },
  });

  return { signUp, isSigningUp, signUpError };
}
