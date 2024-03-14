import { useForm } from "react-hook-form";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { IBooking, IBookingForm } from "../../types";
import { useEditBooking } from "./useEditBooking";

interface CreateBookingForm {
  bookingToEdit?: IBooking | Record<string, never>;
  onCloseModal?: () => void;
}

function CreateBookingForm({ bookingToEdit, onCloseModal }: CreateBookingForm) {
  const { register, handleSubmit, reset } = useForm<IBookingForm>();

  const { editBooking, isEditing } = useEditBooking();

  const isEditSession = Boolean(bookingToEdit?.id);

  function onSubmit(booking: IBookingForm) {
    if (!bookingToEdit?.id) return null;
    editBooking(
      { newBookingData: booking, id: bookingToEdit.id },
      {
        onSuccess: () => {
          reset();
          onCloseModal?.();
        },
      }
    );
  }
  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      type={onCloseModal ? "modal" : "regular"}
    >
      {/* <FormRow label="Cabin">
        <Input type="text" {...register("cabin")}
            disabled={isEditing}
         />
      </FormRow> */}
      {/* <FormRow label="Guest">
        <Input type="text" {...register("guest")}
            disabled={isEditing}
         />
      </FormRow> */}
      {/* <FormRow label="Dates">
        <Input />
      </FormRow> */}
      <FormRow label="Status">
        <Input type="text" {...register("status")} disabled={isEditing} />
      </FormRow>
      <FormRow label="Amount">
        <Input type="text" {...register("totalPrice")} disabled={isEditing} />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <>
          <Button
            $variation="secondary"
            type="reset"
            onClick={() => onCloseModal?.()}
            disabled={isEditing}
          >
            Cancel
          </Button>
          <Button disabled={isEditing}>
            {isEditSession ? "Edit booking" : "Add booking"}
          </Button>
        </>
      </FormRow>
    </Form>
  );
}

export default CreateBookingForm;
