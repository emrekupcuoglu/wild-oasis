import { useForm } from "react-hook-form";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { useSignup } from "./useSignup";

// Email regex: /\S+@\S+\.\S+/

interface SignUpFormParams {
  fullName: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

function SignupForm() {
  const { register, formState, getValues, handleSubmit, reset } =
    useForm<SignUpFormParams>();
  const { errors } = formState;

  const { signUp, isSigningUp } = useSignup();

  function onSubmit(data: SignUpFormParams) {
    signUp(
      {
        email: data.email,
        password: data.password,
        fullName: data.fullName,
      },
      { onSettled: () => reset() }
    );
  }
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="Full name" error={errors.fullName?.message}>
        <Input
          type="text"
          id="fullName"
          disabled={isSigningUp}
          {...register("fullName", { required: "This is a required field" })}
        />
      </FormRow>

      <FormRow label="Email address" error={errors.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isSigningUp}
          {...register("email", {
            required: "This is a required field",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please provide a valid address",
            },
          })}
        />
      </FormRow>

      <FormRow
        label="Password (min 8 characters)"
        error={errors.password?.message}
      >
        <Input
          type="password"
          id="password"
          disabled={isSigningUp}
          {...register("password", {
            required: "This is a required field",
            minLength: {
              value: 8,
              message: "Passwords needs to be at least 8 characters long",
            },
          })}
        />
      </FormRow>

      <FormRow label="Repeat password" error={errors.passwordConfirm?.message}>
        <Input
          type="password"
          id="passwordConfirm"
          disabled={isSigningUp}
          {...register("passwordConfirm", {
            required: "This is a required field",
            validate: (curValue) =>
              curValue === getValues().password || "Passwords need to match",
          })}
        />
      </FormRow>

      <FormRow>
        <>
          {/* type is an HTML attribute! */}
          <Button
            disabled={isSigningUp}
            $variation="secondary"
            type="reset"
            onClick={() => reset()}
          >
            Cancel
          </Button>

          <Button disabled={isSigningUp}>Create new user</Button>
        </>
      </FormRow>
    </Form>
  );
}

export default SignupForm;
