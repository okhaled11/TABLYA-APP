import {
  Avatar,
  Badge,
  Button,
  CloseButton,
  DataList,
  Dialog,
  HStack,
  Portal,
  Stack,
  Textarea,
  VStack,
  Field,
  Input,
  NativeSelect,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { supabase } from "../../services/supabaseClient";

const DeliveryModal = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      vehicle_type: "",
      license_number: "",
      city: "",
    },
  });

  // Sign up user in auth
  const signUpDeliveryUser = async ({
    email,
    password,
    first_name,
    last_name,
    phone,
  }) => {
    const fullName = `${first_name} ${last_name}`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name,
          last_name,
          name: fullName,
          role: "delivery",
          phone,
        },
      },
    });

    if (error) throw error;

    if (!data.user)
      throw new Error("User creation failed or requires email confirmation");

    return data.user;
  };

  // Create delivery record
  const createDeliveryRecord = async ({
    user_id,
    vehicle_type,
    license_number,
    city,
    availability = true,
  }) => {
    const { data, error } = await supabase.from("deliveries").upsert(
      [
        {
          user_id,
          vehicle_type,
          license_number,
          city,
          availability,
        },
      ],
      { onConflict: "user_id" }
    );

    if (error) throw error;
    return data;
  };

  // React Hook Form submit handler
  const onSubmit = async (formData) => {
    try {
      const user = await signUpDeliveryUser({
        email: formData.email,
        password: "delivery123456",
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
      });

      await createDeliveryRecord({
        user_id: user.id,
        vehicle_type: formData.vehicle_type,
        license_number: formData.license_number,
        city: formData.city,
      });

      // alert("Delivery user created successfully!");
      onClose();
      reset();
    } catch (err) {
      console.error(err);
      // alert("Error: " + err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <VStack alignItems="start">
      <Dialog.Root
        placement={"center"}
        motionPreset="slide-in-bottom"
        open={isOpen}
        onOpenChange={(e) => !e.open && onClose()}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Delivery Information</Dialog.Title>
              </Dialog.Header>

              <Dialog.Body pb="6">
                <Stack gap="6">
                  {/* FIRST NAME */}
                  <Field.Root orientation="horizontal">
                    <Field.Label>First Name</Field.Label>
                    <Input
                      placeholder="Enter first name"
                      flex="1"
                      {...register("first_name", {
                        required: "First name is required",
                      })}
                    />
                  </Field.Root>
                  {errors.first_name && (
                    <span style={{ color: "red", fontSize: "13px" }}>
                      {errors.first_name.message}
                    </span>
                  )}

                  {/* LAST NAME */}
                  <Field.Root orientation="horizontal">
                    <Field.Label>Last Name</Field.Label>
                    <Input
                      placeholder="Enter last name"
                      flex="1"
                      {...register("last_name", {
                        required: "Last name is required",
                      })}
                    />
                  </Field.Root>
                  {errors.last_name && (
                    <span style={{ color: "red", fontSize: "13px" }}>
                      {errors.last_name.message}
                    </span>
                  )}

                  {/* EMAIL */}
                  <Field.Root orientation="horizontal">
                    <Field.Label>Email</Field.Label>
                    <Input
                      placeholder="Enter email"
                      flex="1"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: "Invalid email format",
                        },
                      })}
                    />
                  </Field.Root>
                  {errors.email && (
                    <span style={{ color: "red", fontSize: "13px" }}>
                      {errors.email.message}
                    </span>
                  )}

                  {/* PHONE */}
                  <Field.Root orientation="horizontal">
                    <Field.Label>Phone</Field.Label>
                    <Input
                      placeholder="Enter phone"
                      flex="1"
                      {...register("phone", {
                        required: "Phone is required",
                      })}
                    />
                  </Field.Root>
                  {errors.phone && (
                    <span style={{ color: "red", fontSize: "13px" }}>
                      {errors.phone.message}
                    </span>
                  )}

                  {/* VEHICLE TYPE */}
                  <Field.Root orientation="horizontal">
                    <Field.Label>Vehicle Type</Field.Label>
                    <NativeSelect.Root size="md" flex="1">
                      <NativeSelect.Field
                        {...register("vehicle_type", {
                          required: "Vehicle type is required",
                        })}
                      >
                        <option value="">Select vehicle type</option>
                        <option value="bike">Bike</option>
                        <option value="car">Car</option>
                        <option value="motorcycle">Motorcycle</option>
                        <option value="scooter">Scooter</option>
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                  </Field.Root>
                  {errors.vehicle_type && (
                    <span style={{ color: "red", fontSize: "13px" }}>
                      {errors.vehicle_type.message}
                    </span>
                  )}

                  {/* LICENSE NUMBER */}
                  <Field.Root orientation="horizontal">
                    <Field.Label>License Number</Field.Label>
                    <Input
                      placeholder="Enter license number"
                      flex="1"
                      {...register("license_number", {
                        required: "License number is required",
                      })}
                    />
                  </Field.Root>
                  {errors.license_number && (
                    <span style={{ color: "red", fontSize: "13px" }}>
                      {errors.license_number.message}
                    </span>
                  )}

                  {/* CITY */}
                  <Field.Root orientation="horizontal">
                    <Field.Label>City</Field.Label>
                    <Input
                      placeholder="Enter city"
                      flex="1"
                      {...register("city", { required: "City is required" })}
                    />
                  </Field.Root>
                  {errors.city && (
                    <span style={{ color: "red", fontSize: "13px" }}>
                      {errors.city.message}
                    </span>
                  )}

                  <Button
                    colorScheme="orange"
                    mt={4}
                    onClick={handleSubmit(onSubmit)}
                  >
                    Create Delivery
                  </Button>
                </Stack>
              </Dialog.Body>

              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </VStack>
  );
};

export default DeliveryModal;

