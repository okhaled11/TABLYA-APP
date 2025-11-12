
import React, { useState, useEffect } from "react";
import {
  Field,
  Input,
  Stack,
  NativeSelect,
  Button,
  Dialog,
  Portal,
  Spinner,
} from "@chakra-ui/react";
import { useUpdateUserMutation } from "../../app/features/Admin/adminUserManagemnetSlice";

const EditUserModal = ({ user, isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
  });

  const [updateUser, { isLoading }] = useUpdateUserMutation();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!user) return;
    try {
      await updateUser({ id: user.id, ...formData }).unwrap();
      alert("User updated successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update user.");
    }
  };

  if (!user) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius="lg" shadow="lg" maxW="lg">
            <Dialog.Header>
              <Dialog.Title>Edit User: {user.name}</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body pb="6">
              <Stack gap="6" >
                <Field.Root orientation="horizontal">
                  <Field.Label>Name</Field.Label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter name"
                    flex="1"
                  />
                </Field.Root>

                <Field.Root orientation="horizontal">
                  <Field.Label>Email</Field.Label>
                  <Input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    flex="1"
                  />
                </Field.Root>

                <Field.Root orientation="horizontal">
                  <Field.Label>Phone</Field.Label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone"
                    flex="1"
                  />
                </Field.Root>

                <Field.Root orientation="horizontal">
                  <Field.Label>Role</Field.Label>
                  <NativeSelect.Root flex="1">
                    <NativeSelect.Field
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      
                      <option value="customer">Customer</option>
                      <option value="cooker">Chef</option>
                      <option value="delivery">Delivery</option>
                      <option value="admin">Admin</option>
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Field.Root>
              </Stack>
            </Dialog.Body>

            <Dialog.Footer>
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSubmit}
                isDisabled={isLoading}
              >
                {isLoading ? <Spinner size="sm" /> : "Save Changes"}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default EditUserModal;
