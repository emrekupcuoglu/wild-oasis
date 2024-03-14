// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";

// import Input from "../../ui/Input";
// import Form from "../../ui/Form";
// import Button from "../../ui/Button";
// import FileInput from "../../ui/FileInput";
// import Textarea from "../../ui/Textarea";

// import { createCabin } from "../../services/apiCabins";

// import { ICabinFormData } from "../../types";

// import FormRow from "../../ui/FormRow";

// function CreateCabinForm() {
//   const queryClient = useQueryClient();
//   const { mutate, isPending } = useMutation({
//     mutationFn: createCabin,
//     onSuccess: () => {
//       toast.success("New cabin successfully created");
//       queryClient.invalidateQueries({ queryKey: ["cabins"] });
//       reset();
//     },
//     onError: (err) => toast.error(err.message),
//   });

//   const { register, handleSubmit, reset, getValues, formState } =
//     useForm<ICabinFormData>();

//   // This return the same errors that are passed into the onError function
//   const { errors } = formState;

//   // onSubmit prop in the <Form> component (not the function we have created but really the prop), receives the handleSubmit function that useForm returns. handleSubmit takes the function we want to be executed as the argument, and calls that function with the data from the form.
//   function onSubmit(data: ICabinFormData) {
//     console.log("data", data);
//     mutate({ ...data, image: data.image[0] });
//   }

//   // In case there is an error such as validation error, handleSubmit will not call the onSubmit function but it will call the second argument we pass in. Which we will pass in onError
//   function onError(errors) {
//     console.log("errors", errors);
//   }
//   return (
//     <Form onSubmit={handleSubmit(onSubmit, onError)}>
//       <FormRow label="Cabin name" error={errors?.name?.message}>
//         {/* register function returns a set of props such as onChange and onBlur. We spread them to add these props to our inputs. It takes a string as an argument and sets that argument to the name attribute of the input (e.g. name="inputName"). We can pass in a second argument for validation */}
//         <Input
//           type="text"
//           id="name"
//           disabled={isPending}
//           {...register("name", { required: "This field is required" })}
//         />
//       </FormRow>

//       <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
//         <Input
//           type="number"
//           id="maxCapacity"
//           disabled={isPending}
//           {...register("maxCapacity", {
//             required: "This field is required",
//             min: { value: 1, message: "Capacity should be at least 1." },
//           })}
//         />
//       </FormRow>

//       <FormRow label="Regular price" error={errors?.regularPrice?.message}>
//         <Input
//           type="number"
//           id="regularPrice"
//           disabled={isPending}
//           {...register("regularPrice", {
//             required: "This field is required",
//             min: { value: 1, message: "Price should be at least 1." },
//           })}
//         />
//       </FormRow>

//       <FormRow label="Discount" error={errors?.discount?.message}>
//         <Input
//           type="number"
//           id="discount"
//           defaultValue={0}
//           disabled={isPending}
//           {...register("discount", {
//             required: "This field is required",
//             validate: (val) =>
//               Number(val) <= Number(getValues().regularPrice) ||
//               "Discount should be less than the regular price",
//           })}
//         />
//       </FormRow>

//       <FormRow
//         label="Description for website"
//         error={errors?.description?.message}
//       >
//         <Textarea
//           // type="text"
//           id="description"
//           defaultValue=""
//           disabled={isPending}
//           {...register("description", { required: "This field is required" })}
//         />
//       </FormRow>

//       <FormRow label="image" error={errors?.name?.message}>
//         <FileInput
//           id="image"
//           accept="image/*"
//           {...register("image", { required: "This field is required" })}
//         />
//       </FormRow>

//       <FormRow>
//         <>
//           {/* type is an HTML attribute! */}
//           <Button $variation="secondary" type="reset">
//             Cancel
//           </Button>
//           <Button disabled={isPending}>Edit cabin</Button>
//         </>
//       </FormRow>
//     </Form>
//   );
// }

// export default CreateCabinForm;
