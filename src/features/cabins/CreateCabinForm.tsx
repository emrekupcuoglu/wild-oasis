import { SubmitErrorHandler, useForm } from "react-hook-form";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";

import { ICabin, ICabinFormData } from "../../types";

import FormRow from "../../ui/FormRow";
import { getImageNameFromUrl } from "../../utils/helpers";
import { useCreateCabin } from "./useCreateCabin";
import { useEditCabin } from "./useEditCabin";

interface CreateCabinForm {
  cabinToEdit?: ICabin | Record<string, never>;
  onCloseModal?: () => void;
}

function CreateCabinForm({ cabinToEdit = {}, onCloseModal }: CreateCabinForm) {
  const { id: editId, ...editValue } = cabinToEdit;
  const isEditSession = Boolean(editId);

  const { isCreating, createCabin } = useCreateCabin();

  const { isEditing, editCabin } = useEditCabin();

  const isWorking = isCreating || isEditing;

  const { register, handleSubmit, reset, getValues, formState } = useForm<
    ICabinFormData | ICabin
  >({ defaultValues: isEditSession ? editValue : {} });

  // This return the same errors that are passed into the onError function
  const { errors } = formState;

  // onSubmit prop in the <Form> component (not the function we have created but really the prop), receives the handleSubmit function that useForm returns. handleSubmit takes the function we want to be executed as the argument, and calls that function with the data from the form.
  function onSubmit(data: ICabinFormData | ICabin) {
    console.log("data", data);

    const curImg = getImageNameFromUrl(editValue?.image || "");
    const image = typeof data.image === "string" ? data.image : data.image?.[0];

    if (isEditSession && editId) {
      editCabin(
        {
          newCabinData: { ...(data as ICabinFormData), image },
          id: editId,
          curImg: curImg ? curImg : "",
        },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    } else
      createCabin(
        { ...(data as ICabinFormData), image: data?.image?.[0] },
        // We can also access the onSuccess here in the mutate function. createCabin is just a renamed version of the mutate function returned by the useMutation hook. Here we can also get access to the data that is the result of the fetch request. So here we can access to the data we are returning from supabase inside the apiCabin.ts/createEditCabin
        {
          onSuccess: (/*data*/) => {
            reset();
            onCloseModal?.();
          },
        }
      );
  }

  // In case there is an error such as validation error, handleSubmit will not call the onSubmit function but it will call the second argument we pass in. Which we will pass in onError
  function onError(errors: string) {
    console.log("errors", errors);
  }
  return (
    <Form
      onSubmit={handleSubmit(
        onSubmit,
        onError as SubmitErrorHandler<ICabin | ICabinFormData>
      )}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="Cabin name" error={errors?.name?.message}>
        {/* register function returns a set of props such as onChange and onBlur. We spread them to add these props to our inputs. It takes a string as an argument and sets that argument to the name attribute of the input (e.g. name="inputName"). We can pass in a second argument for validation */}
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register("name", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isWorking}
          {...register("maxCapacity", {
            required: "This field is required",
            min: { value: 1, message: "Capacity should be at least 1." },
          })}
        />
      </FormRow>

      <FormRow label="Regular price" error={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          disabled={isWorking}
          {...register("regularPrice", {
            required: "This field is required",
            min: { value: 1, message: "Price should be at least 1." },
          })}
        />
      </FormRow>

      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          defaultValue={0}
          disabled={isWorking}
          {...register("discount", {
            validate: (val) =>
              Number(val) <= Number(getValues().regularPrice) ||
              "Discount should be less than the regular price",
          })}
        />
      </FormRow>

      <FormRow
        label="Description for website"
        error={errors?.description?.message}
      >
        <Textarea
          id="description"
          defaultValue=""
          disabled={isWorking}
          {...register("description", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow label="image" error={errors?.name?.message}>
        <FileInput
          id="image"
          accept="image/*"
          {...register("image", {
            required: isEditSession ? false : "This field is required",
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <>
          <Button
            $variation="secondary"
            type="reset"
            onClick={() => onCloseModal?.()}
          >
            Cancel
          </Button>
          <Button disabled={isWorking}>
            {isEditSession ? "Edit cabin" : "Add cabin"}
          </Button>
        </>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
