import { useForm } from "react-hook-form";
import Form from "../../ui/Form.tsx";
import FormRow from "../../ui/FormRow.tsx";
import Input from "../../ui/Input.tsx";

import { useUpdateSetting } from "./useUpdateSetting.ts";
import { ISettings } from "../../types.ts";

function UpdateSettingsForm({ settings }: { settings: ISettings }) {
  console.log(settings);
  const { register } = useForm({
    defaultValues: {
      "min-nights": settings.minBookingLength,
      "max-nights": settings.maxBookingLength,
      "max-guests": settings.maxGuestPerBooking,
      "breakfast-price": settings.breakfastPrice,
    },
  });

  const { isUpdating, updateSetting } = useUpdateSetting();

  function handleUpdate(
    e: React.FocusEvent<HTMLInputElement>,
    fieldId: string
  ) {
    const { value } = e.target;
    console.log(e);

    if (!value) return;

    updateSetting({ newCabin: { [fieldId]: value } });
  }

  return (
    <Form>
      <FormRow label="Minimum nights/booking">
        <Input
          type="number"
          id="min-nights"
          {...register("min-nights", {
            onBlur: (e: React.FocusEvent<HTMLInputElement>) =>
              handleUpdate(e, "minBookingLength"),
          })}
          disabled={isUpdating}
        />
      </FormRow>
      <FormRow label="Maximum nights/booking">
        <Input
          type="number"
          id="max-nights"
          {...register("max-nights", {
            onBlur: (e: React.FocusEvent<HTMLInputElement>) =>
              handleUpdate(e, "maxBookingLength"),
          })}
        />
      </FormRow>
      <FormRow label="Maximum guests/booking">
        <Input
          type="number"
          id="max-guests"
          {...register("max-guests", {
            onBlur: (e: React.FocusEvent<HTMLInputElement>) =>
              handleUpdate(e, "maxGuestPerBooking"),
          })}
        />
      </FormRow>
      <FormRow label="Breakfast price">
        <Input
          type="number"
          id="breakfast-price"
          {...register("breakfast-price", {
            onBlur: (e: React.FocusEvent<HTMLInputElement>) =>
              handleUpdate(e, "breakfastPrice"),
          })}
        />
      </FormRow>
    </Form>
  );
}

export default UpdateSettingsForm;
