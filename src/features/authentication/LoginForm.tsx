import { useEffect } from "react";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import Input from "../../ui/Input";
import FormRowVertical from "../../ui/FormRowVertical";
import { useForm } from "react-hook-form";
import { useLogin } from "./useLogin";
import SpinnerMini from "../../ui/SpinnerMini";
import { useUser } from "./useUser";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Spinner from "../../ui/Spinner";

function LoginForm() {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");

  interface ILogin {
    email: string;
    password: string;
  }

  const queryClient = useQueryClient();
  const { register, reset, handleSubmit } = useForm<ILogin>({
    defaultValues: { email: "emre@example.com", password: "pass0987" },
  });
  const { login, isLoggingIn, loginError } = useLogin();
  const { user, isAuthenticated, isPending } = useUser();
  const navigate = useNavigate();

  function onSubmit(data: ILogin) {
    if (!data.email || !data.password) return;
    login(
      { email: data.email, password: data.password },
      { onError: () => reset({ password: "" }) }
    );
  }

  useEffect(() => {
    if (isAuthenticated && !isPending && !loginError) {
      queryClient.invalidateQueries({ refetchType: "active" });
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, isAuthenticated, isPending, loginError, queryClient, user]);

  if (isPending || isAuthenticated) return <Spinner />;

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRowVertical label="Email address">
        <Input
          type="email"
          id="email"
          // This makes this form better for password managers
          autoComplete="username"
          // value={email}
          // onChange={(e) => setEmail(e.target.value)}
          {...register("email", { required: "Please enter your username" })}
          disabled={isLoggingIn}
        />
      </FormRowVertical>
      <FormRowVertical label="Password">
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          // value={password}
          // onChange={(e) => setPassword(e.target.value)}
          {...register("password", {
            required: "Please enter your password",
          })}
          disabled={isLoggingIn}
        />
      </FormRowVertical>
      <FormRowVertical>
        <Button size="large" disabled={isLoggingIn}>
          {isLoggingIn ? <SpinnerMini /> : <span>Login</span>}
        </Button>
      </FormRowVertical>
    </Form>
  );
}

export default LoginForm;
