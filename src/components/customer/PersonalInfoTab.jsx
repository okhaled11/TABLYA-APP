import {
  Box,
  VStack,
  Text,
  Button,
  HStack,
  Avatar,
  IconButton,
  Grid,
  GridItem,
  Skeleton,
  SkeletonCircle,
} from "@chakra-ui/react";
import { User, Envelope, Phone, PencilSimple } from "@phosphor-icons/react";
import { useState, useRef, useEffect } from "react";
import { toaster } from "../ui/toaster";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useUploadAvatarMutation,
} from "../../app/features/Customer/personalInfoSlice";
import { convertImageToWebP } from "../../services";
import { useColorStyles } from "../../hooks/useColorStyles";
import FormField from "../ui/FormField";

export default function PersonalInfoTab() {
  const styles = useColorStyles();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  // Get user data from auth.users
  const { data: user, isLoading, refetch } = useGetUserProfileQuery();
  const [updateUserProfile, { isLoading: isUpdating }] =
    useUpdateUserProfileMutation();
  const [uploadAvatar, { isLoading: isUploading }] = useUploadAvatarMutation();

  // Update state when user data changes
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  // Handle avatar upload
  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toaster.create({
        title: "Invalid File",
        description: "Please select an image file",
        type: "error",
        duration: 3000,
      });
      return;
    }

    // Validate file size (max 5MB before conversion)
    if (file.size > 5 * 1024 * 1024) {
      toaster.create({
        title: "File Too Large",
        description: "Image size should be less than 5MB",
        type: "error",
        duration: 3000,
      });
      return;
    }

    try {
      // Convert image to WebP format with max dimensions
      const webpFile = await convertImageToWebP(file, {
        quality: 0.85,
        maxWidth: 800,
        maxHeight: 800,
      });

      await uploadAvatar(webpFile).unwrap();
      toaster.create({
        title: "Success",
        description: "Profile picture updated successfully",
        type: "success",
        duration: 3000,
      });
      
      // Refetch user data to show updated avatar
      refetch();
    } catch (error) {
      toaster.create({
        title: "Error",
        description: error.message || "Failed to upload avatar",
        type: "error",
        duration: 3000,
      });
    }
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    try {
      await updateUserProfile({
        firstName,
        lastName,
        email,
        phone,
      }).unwrap();

      toaster.create({
        title: "Success",
        description: "Profile updated successfully in auth.users",
        type: "success",
        duration: 3000,
      });
      
      // Refetch user data from auth.users to show updated info
      refetch();
      setIsEditing(false);
    } catch (error) {
      toaster.create({
        title: "Error",
        description: error.message || "Failed to update profile",
        type: "error",
        duration: 3000,
      });
    }
  };

  // Handle discard changes
  const handleDiscardChanges = () => {
    setFirstName(user?.firstName || "");
    setLastName(user?.lastName || "");
    setEmail(user?.email || "");
    setPhone(user?.phone || "");
    setIsEditing(false);
  };

  return (
    <Box bg={styles.bgThird} borderRadius="25px" p={8}>
      {isLoading ? (
        <VStack spacing={8} align="stretch">
          {/* Avatar Skeleton */}
          <VStack spacing={3}>
            <SkeletonCircle size="120px" />
            <Skeleton height="30px" width="150px" />
          </VStack>

          {/* Form Fields Skeleton */}
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
            {[1, 2, 3, 4].map((i) => (
              <GridItem key={i}>
                <VStack align="stretch" spacing={2}>
                  <Skeleton height="20px" width="100px" />
                  <Skeleton height="45px" borderRadius="12px" />
                </VStack>
              </GridItem>
            ))}
          </Grid>

          {/* Buttons Skeleton */}
          <HStack spacing={4} mt={4}>
            <Skeleton flex={1} height="50px" borderRadius="12px" />
            <Skeleton flex={1} height="50px" borderRadius="12px" />
          </HStack>
        </VStack>
      ) : (
        <VStack spacing={8} align="stretch">
          {/* Avatar Section */}
          <VStack spacing={3}>
          <Box position="relative">
            <Avatar.Root
              size="2xl"
              borderColor={styles.mainFixed}
              borderWidth="3px"
            >
              <Avatar.Image
                src={
                  user?.avatar_url ||
                  `https://ui-avatars.com/api/?name=${user?.name}`
                }
              />
            </Avatar.Root>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarUpload}
              accept="image/*"
              style={{ display: "none" }}
            />
            <IconButton
              position="absolute"
              bottom="0"
              right="0"
              size="sm"
              borderRadius="full"
              bg={styles.mainFixed}
              color="white"
              onClick={() => fileInputRef.current?.click()}
              isLoading={isUploading}
              _hover={{ bg: styles.mainFixed70a }}
            >
              <PencilSimple size={16} weight="fill" />
            </IconButton>
          </Box>
          <Text fontSize="xl" fontWeight="bold" color={styles.textMain}>
            {user?.name || "User"}
          </Text>
        </VStack>

        {/* Form Fields */}
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
          <GridItem>
            <FormField
              label="First Name"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                setIsEditing(true);
              }}
            />
          </GridItem>

          <GridItem>
            <FormField
              label="Last Name"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                setIsEditing(true);
              }}
            />
          </GridItem>

          <GridItem>
            <FormField
              label="Email"
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setIsEditing(true);
              }}
            />
          </GridItem>

          <GridItem>
            <FormField
              label="Phone"
              placeholder="Enter your phone number"
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setIsEditing(true);
              }}
            />
          </GridItem>
        </Grid>

        {/* Buttons */}
        <HStack spacing={4} mt={4}>
          <Button
            flex={1}
            bg={styles.mainFixed}
            color="white"
            borderRadius="12px"
            size="lg"
            onClick={handleSaveChanges}
            isLoading={isUpdating}
            loadingText="Saving..."
            isDisabled={!isEditing}
            _hover={{ bg: styles.mainFixed70a }}
            _loading={{
              bg: styles.mainFixed,
              opacity: 0.7,
            }}
          >
            Save Changes
          </Button>
          <Button
            flex={1}
            variant="outline"
            borderColor={styles.mainFixed}
            color={styles.mainFixed}
            borderRadius="12px"
            size="lg"
            onClick={handleDiscardChanges}
            isDisabled={!isEditing || isUpdating}
            _hover={{ bg: styles.mainFixed10a }}
          >
            Discard Changes
          </Button>
        </HStack>
        </VStack>
      )}
    </Box>
  );
}
