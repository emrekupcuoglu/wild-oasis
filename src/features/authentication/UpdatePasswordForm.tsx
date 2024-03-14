import { useForm } from "react-hook-form";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { useUpdateUser } from "./useUpdateUser";

function UpdatePasswordForm() {
  interface IPasswordForm {
    password: string;
    newPassword: string;
    passwordConfirm: string;
  }
  const { register, handleSubmit, formState, getValues, reset } =
    useForm<IPasswordForm>();
  const { errors } = formState;

  const { updateCurrentUser, isUpdating } = useUpdateUser();

  function onSubmit({ password, newPassword }: IPasswordForm) {
    updateCurrentUser({ password, newPassword }, { onSuccess: () => reset() });
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow
        label="Password (min 8 characters)"
        error={errors?.password?.message}
      >
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          disabled={isUpdating}
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 8,
              message: "Password needs a minimum of 8 characters",
            },
          })}
        />
      </FormRow>
      <FormRow
        label="Password (min 8 characters)"
        error={errors?.password?.message}
      >
        <Input
          type="password"
          id="newPassword"
          autoComplete="new-password"
          disabled={isUpdating}
          {...register("newPassword", {
            required: "This field is required",
            minLength: {
              value: 8,
              message: "Password needs a minimum of 8 characters",
            },
          })}
        />
      </FormRow>

      <FormRow
        label="Confirm password"
        error={errors?.passwordConfirm?.message}
      >
        <Input
          type="password"
          autoComplete="new-password"
          id="passwordConfirm"
          disabled={isUpdating}
          {...register("passwordConfirm", {
            required: "This field is required",
            validate: (value) =>
              getValues().newPassword === value || "Passwords need to match",
          })}
        />
      </FormRow>
      <FormRow>
        <>
          <Button onClick={() => reset()} type="reset" $variation="secondary">
            Cancel
          </Button>
          <Button disabled={isUpdating}>Update password</Button>
        </>
      </FormRow>
    </Form>
  );
}

export default UpdatePasswordForm;
