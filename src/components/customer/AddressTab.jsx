import {
  Box,
  VStack,
  Text,
  Input,
  Button,
  HStack,
  IconButton,
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogCloseTrigger,
  DialogBackdrop,
  Separator,
  Grid,
  GridItem,
  Skeleton,
  SkeletonCircle,
} from "@chakra-ui/react";
import { useColorMode } from "../../theme/color-mode";
import colors from "../../theme/color";
import { MapPin, Trash, Plus, Pen, MapTrifold } from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import { toaster } from "../ui/toaster";
import { supabase } from "../../services/supabaseClient";
import {
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetPrimaryAddressMutation,
} from "../../app/features/Customer/addressSlice";

export default function AddressTab() {
  const { colorMode } = useColorMode();
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [newAddressLabel, setNewAddressLabel] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [street, setStreet] = useState("");
  const [buildingNumber, setBuildingNumber] = useState("");
  const [floor, setFloor] = useState("");
  const [apartment, setApartment] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isPrimary, setIsPrimary] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [addressErrors, setAddressErrors] = useState({
    label: "",
    city: "",
    area: "",
    street: "",
    buildingNumber: "",
  });

  // API hooks
  const { data: addresses = [], refetch, isLoading } = useGetAddressesQuery();
  const [addAddress] = useAddAddressMutation();
  const [updateAddress] = useUpdateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();
  const [setPrimaryAddress] = useSetPrimaryAddressMutation();

  // Realtime subscription for addresses
  useEffect(() => {
    const channel = supabase
      .channel("addresses-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "addresses",
        },
        () => {
          // Refetch addresses when any change happens
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const handleGetCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toaster.create({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        type: "error",
        duration: 3000,
      });
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords;

        console.log("📍 Current Location:", { lat, lng });
        console.log("📍 Accuracy:", position.coords.accuracy, "meters");

        try {
          // Save coordinates
          setLatitude(lat);
          setLongitude(lng);

          // Use Nominatim (OpenStreetMap) for reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
          );
          const data = await response.json();
          
          console.log("🗺️ Reverse Geocoding Response:", data);

          if (data && data.address) {
            // Extract address components
            const address = data.address;
            
            console.log("📋 Address Components:", address);
            
            // Set city
            const cityName = address.city || address.town || address.village || address.county || "";
            setCity(cityName);

            // Set area with smart logic for neighbourhood and residential
            let areaName = "";
            const hasNeighbourhood = address.neighbourhood || false;
            const hasResidential = address.residential || false;
            
            // If both neighbourhood and residential exist, use the standard area (suburb/district)
            if (hasNeighbourhood && hasResidential) {
              areaName = address.suburb || address.district || address.hamlet || "";
              console.log("🏘️ Both neighbourhood & residential found, using standard area:", areaName);
            } 
            // If only one exists, use it
            else if (hasNeighbourhood || hasResidential) {
              areaName = hasNeighbourhood ? address.neighbourhood : address.residential;
              console.log("🏘️ Using specific area:", areaName, hasNeighbourhood ? "(neighbourhood)" : "(residential)");
            }
            // Otherwise, use standard area fields
            else {
              areaName = address.suburb || address.district || address.hamlet || "";
              console.log("🏘️ Using standard area:", areaName);
            }
            setArea(areaName);

            // Set street with comprehensive fallback logic
            let streetName = address.road || address.street || address.pedestrian || "";
            
            // If no direct street found, try alternative paths and ways
            if (!streetName) {
              streetName = address.footway || address.cycleway || address.path || 
                          address.track || address.alley || "";
              if (streetName) {
                console.log("🛣️ Using alternative path:", streetName);
              }
            }
            
            // If still no street, try using nearby landmarks or amenities
            if (!streetName) {
              streetName = address.amenity || address.shop || address.building || 
                          address.tourism || address.leisure || "";
              if (streetName) {
                console.log("🏢 Using nearby landmark:", streetName);
              }
            }
            
            // If still nothing, try using highway or place names
            if (!streetName) {
              streetName = address.highway || address.place || "";
              if (streetName) {
                console.log("🗺️ Using place/highway name:", streetName);
              }
            }
            
            setStreet(streetName);

            // Set building number if available
            const houseNumber = address.house_number || "";
            setBuildingNumber(houseNumber);

            console.log("✅ Extracted Address:", {
              city: cityName,
              area: areaName,
              street: streetName,
              building: houseNumber,
              hasNeighbourhood,
              hasResidential,
            });

            toaster.create({
              title: "Success",
              description: `Location detected: ${cityName || "Unknown city"}`,
              type: "success",
              duration: 3000,
            });
          } else {
            console.warn("⚠️ No address data returned from API");
            toaster.create({
              title: "Warning",
              description: "Could not get address details. Please enter manually.",
              type: "warning",
              duration: 3000,
            });
          }
        } catch (error) {
          console.error("❌ Reverse Geocoding Error:", error);
          toaster.create({
            title: "Error",
            description: "Failed to get address from location. Coordinates saved.",
            type: "error",
            duration: 3000,
          });
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        console.error("❌ Geolocation Error:", error);
        setIsGettingLocation(false);
        let errorMessage = "Failed to get your location";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied. Please enable location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
          default:
            errorMessage = "An unknown error occurred";
        }

        toaster.create({
          title: "Error",
          description: errorMessage,
          type: "error",
          duration: 3000,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleSaveAddress = async () => {
    // Reset errors
    setAddressErrors({ label: "", city: "", area: "", street: "", buildingNumber: "" });

    // Validation
    let hasError = false;
    const errors = { label: "", city: "", area: "", street: "", buildingNumber: "" };

    if (!newAddressLabel) {
      errors.label = "Please select an address label";
      hasError = true;
    }

    if (!city.trim()) {
      errors.city = "Please enter city";
      hasError = true;
    }

    if (!area.trim()) {
      errors.area = "Please enter area";
      hasError = true;
    }

    if (!street.trim()) {
      errors.street = "Please enter street";
      hasError = true;
    }

    if (!buildingNumber.trim()) {
      errors.buildingNumber = "Please enter a building number";
      hasError = true;
    }

    if (hasError) {
      setAddressErrors(errors);
      return;
    }

    try {
      const addressData = {
        id: editingAddressId,
        label: newAddressLabel,
        city: city.trim(),
        area: area.trim(),
        street: street.trim(),
        buildingNumber: buildingNumber.trim(),
        floor: floor.trim(),
        apartment: apartment.trim(),
        latitude: latitude,
        longitude: longitude,
        isPrimary: isPrimary,
      };

      console.log("💾 Saving Address Data:", addressData);

      if (editingAddressId) {
        // Update existing address
        await updateAddress(addressData).unwrap();

        toaster.create({
          title: "Success",
          description: "Address updated successfully",
          type: "success",
          duration: 3000,
        });
      } else {
        // Add new address
        await addAddress(addressData).unwrap();

        toaster.create({
          title: "Success",
          description: "Address added successfully",
          type: "success",
          duration: 3000,
        });
      }

      // Close dialog and reset
      setIsAddressDialogOpen(false);
      setNewAddressLabel("");
      setCity("");
      setArea("");
      setStreet("");
      setBuildingNumber("");
      setFloor("");
      setApartment("");
      setLatitude(null);
      setLongitude(null);
      setIsPrimary(false);
      setEditingAddressId(null);
    } catch (error) {
      toaster.create({
        title: "Error",
        description: error.message || "Failed to save address",
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleEditAddress = (addr) => {
    setNewAddressLabel(addr.label);
    setCity(addr.city || "");
    setArea(addr.area || "");
    setStreet(addr.street || "");
    setBuildingNumber(addr.building_no || "");
    setFloor(addr.floor || "");
    setApartment(addr.apartment || "");
    setLatitude(addr.latitude || null);
    setLongitude(addr.longitude || null);
    setIsPrimary(addr.is_default);
    setEditingAddressId(addr.id);
    setIsAddressDialogOpen(true);
  };

  const handleDeleteAddress = async (id) => {
    try {
      await deleteAddress(id).unwrap();
      toaster.create({
        title: "Success",
        description: "Address deleted successfully",
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      toaster.create({
        title: "Error",
        description: error.message || "Failed to delete address",
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleSetPrimary = async (id) => {
    try {
      await setPrimaryAddress(id).unwrap();
      toaster.create({
        title: "Success",
        description: "Primary address updated",
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      toaster.create({
        title: "Error",
        description: error.message || "Failed to set primary address",
        type: "error",
        duration: 3000,
      });
    }
  };

  return (
    <>
      <Box
        bg={
          colorMode === "light" ? colors.light.bgThird : colors.dark.bgThird
        }
        borderRadius="25px"
        p={8}
      >
        <VStack spacing={6} align="stretch">
          {/* Loading Skeleton */}
          {isLoading ? (
            <>
              {[1, 2, 3].map((i) => (
                <HStack key={i} spacing={3} align="start">
                  <SkeletonCircle size="20px" mt={6} />
                  <Box flex={1}>
                    <Skeleton height="120px" borderRadius="12px" />
                  </Box>
                </HStack>
              ))}
              <Skeleton height="50px" borderRadius="12px" width="30%" alignSelf="center" />
            </>
          ) : (
            <>
              {/* Address List */}
              {addresses.map((addr) => (
            <HStack key={addr.id} spacing={3} align="start">
              {/* Radio Button for Primary Selection - Outside the box */}
              <Box
                w="20px"
                h="20px"
                borderRadius="full"
                border={`2px solid ${
                  addr.is_default
                    ? colorMode === "light"
                      ? colors.light.mainFixed
                      : colors.dark.mainFixed
                    : colorMode === "light"
                    ? colors.light.border1
                    : colors.dark.border1
                }`}
                bg={
                  addr.is_default
                    ? colorMode === "light"
                      ? colors.light.mainFixed
                      : colors.dark.mainFixed
                    : "transparent"
                }
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
                cursor="pointer"
                onClick={() => handleSetPrimary(addr.id)}
                transition="all 0.2s"
                _hover={{
                  transform: "scale(1.1)",
                  borderColor:
                    colorMode === "light"
                      ? colors.light.mainFixed
                      : colors.dark.mainFixed,
                }}
                mt={6}
              >
                {addr.is_default && (
                  <Box w="8px" h="8px" borderRadius="full" bg="white" />
                )}
              </Box>

              {/* Address Card */}
              <Box
              
                flex={1}
                bg={
                  colorMode === "light"
                    ? colors.light.bgFourth
                    : colors.dark.bgFourth
                }
                borderRadius="12px"
                p={5}
                border={
                  addr.is_default
                    ? `2px solid ${
                        colorMode === "light"
                          ? colors.light.mainFixed
                          : colors.dark.mainFixed
                      }`
                    : "none"
                }
              >
                <HStack justify="space-between" align="start">
                  <HStack spacing={3} flex={1} align="start">
                    <Box
                      bg={
                        colorMode === "light"
                          ? colors.light.mainFixed10a
                          : colors.dark.mainFixed10a
                      }
                      borderRadius="12px"
                      p={3}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      mt={1}
                    >
                      <MapPin 
                        size={28} 
                        weight="fill" 
                        color={
                          colorMode === "light"
                            ? colors.light.mainFixed
                            : colors.dark.mainFixed
                        }
                      />
                    </Box>
                    <VStack align="start" spacing={1} flex={1}>
                      <HStack>
                        <Text
                          fontWeight="bold"
                          color={
                            colorMode === "light"
                              ? colors.light.textMain
                              : colors.dark.textMain
                          }
                        >
                          {addr.label}
                        </Text>
                        {addr.is_default && (
                          <Box
                            bg={
                              colorMode === "light"
                                ? colors.light.success20a
                                : colors.dark.success20a
                            }
                            color={
                              colorMode === "light"
                                ? colors.light.success
                                : colors.dark.success
                            }
                            
                            px={2}
                            py={0.5}
                            borderRadius="full"
                            fontSize="xs"
                          >
                            Primary
                          </Box>
                        )}
                      </HStack>
                      <Text
                        fontSize="sm"
                        color={
                          colorMode === "light"
                            ? colors.light.textSub
                            : colors.dark.textSub
                        }
                      >
                        {`${addr.building_no} ${addr.street}, ${addr.area}, ${addr.city}${addr.floor ? `, Floor ${addr.floor}` : ""}${addr.apartment ? `, Apt ${addr.apartment}` : ""}`}
                      </Text>
                    </VStack>
                  </HStack>
                  <HStack spacing={2}>
                    <IconButton
                      size="sm"
                      variant="ghost"
                      color={
                        colorMode === "light"
                          ? colors.light.textSub
                          : colors.dark.textSub
                      }
                      onClick={() => handleEditAddress(addr)}
                      _hover={{
                        bg:
                          colorMode === "light"
                            ? colors.light.bgFourth
                            : colors.dark.bgFourth,
                      }}
                    >
                      <Pen  size={18} />
                    </IconButton>
                    <IconButton
                      size="sm"
                      variant="ghost"
                      color={
                        colorMode === "light"
                          ? colors.light.error
                          : colors.dark.error
                      }
                      onClick={() => handleDeleteAddress(addr.id)}
                      _hover={{
                        bg:
                          colorMode === "light"
                            ? colors.light.error10a
                            : colors.dark.error10a,
                      }}
                    >
                      <Trash size={18} />
                    </IconButton>
                  </HStack>
                </HStack>
              </Box>
            </HStack>
          ))}

              {/* Add New Address Button */}
              <Button
                width={"30%"}
                alignSelf="center"
                variant="outline"
                borderColor={
                  colorMode === "light"
                    ? colors.light.mainFixed
                    : colors.dark.mainFixed
                }
                bg="transparent"
                color={
                  colorMode === "light"
                    ? colors.light.mainFixed
                    : colors.dark.mainFixed
                }
                borderRadius="12px"
                size="lg"
                borderWidth="2px"
                leftIcon={<Plus size={20} weight="bold" />}
                onClick={() => setIsAddressDialogOpen(true)}
                _hover={{
                  bg:
                    colorMode === "light"
                      ? colors.light.mainFixed10a
                      : colors.dark.mainFixed10a,
                }}
              > 
                + Add Address
              </Button>
            </>
          )}
        </VStack>
      </Box>

      {/* Add/Edit Address Dialog */}
      <DialogRoot
        open={isAddressDialogOpen}
        onOpenChange={(e) => {
          setIsAddressDialogOpen(e.open);
          if (!e.open) {
            setNewAddressLabel("");
            setCity("");
            setArea("");
            setStreet("");
            setBuildingNumber("");
            setFloor("");
            setApartment("");
            setLatitude(null);
            setLongitude(null);
            setIsPrimary(false);
            setEditingAddressId(null);
            setAddressErrors({ label: "", city: "", area: "", street: "", buildingNumber: "" });
          }
        }}
        size="md"
      >
        <DialogBackdrop bg="blackAlpha.700" backdropFilter="blur(4px)" />
        <DialogContent
          bg={
            colorMode === "light"
              ? colors.light.bgThird
              : colors.dark.bgThird
          }
          borderRadius="20px"
          maxW={{ base: "90%", sm: "500px", md: "700px", lg: "800px" }}
          w="full"
          position="fixed"
          top="40%"
          left="50%"
          transform="translate(-50%, -50%)"
          maxH="90vh"
          overflowY="auto"
        >
          <DialogHeader pb={2} display="block">
            <DialogTitle
              color={
                colorMode === "light"
                  ? colors.light.textMain
                  : colors.dark.textMain
              }
              fontSize="2xl"
            >
              {editingAddressId ? "Edit Address" : "Add New Address"}
            </DialogTitle>
            <Text
              fontSize="sm"
              color={
                colorMode === "light"
                  ? colors.light.textSub
                  : colors.dark.textSub
              }
              mt={1}
          
            >
              Provide your address information
            </Text>
          </DialogHeader>
          <DialogCloseTrigger />

          <Separator
            borderColor={
              colorMode === "light"
                ? colors.light.border1
                : colors.dark.border1
            }
          />

          <DialogBody py={6}>
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
              gap={5}
            >
              {/* Label Selection - Full Width */}
              <GridItem colSpan={{ base: 1, md: 2 }}>
                <VStack align="stretch" spacing={2}>
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color={
                      colorMode === "light"
                        ? colors.light.textMain
                        : colors.dark.textMain
                    }
                  >
                    Label
                  </Text>
                  <HStack spacing={3}>
                    {/* Home Button */}
                    <Button
                      flex={1}
                      variant="outline"
                      borderColor={
                        newAddressLabel === "Home"
                          ? colorMode === "light"
                            ? colors.light.mainFixed
                            : colors.dark.mainFixed
                          : colorMode === "light"
                          ? colors.light.border1
                          : colors.dark.border1
                      }
                      bg={
                        newAddressLabel === "Home"
                          ? colorMode === "light"
                            ? colors.light.mainFixed10a
                            : colors.dark.mainFixed10a
                          : "transparent"
                      }
                      color={
                        newAddressLabel === "Home"
                          ? colorMode === "light"
                            ? colors.light.mainFixed
                            : colors.dark.mainFixed
                          : colorMode === "light"
                          ? colors.light.textMain
                          : colors.dark.textMain
                      }
                      borderRadius="12px"
                      onClick={() => {
                        setNewAddressLabel("Home");
                        if (addressErrors.label) {
                          setAddressErrors({ ...addressErrors, label: "" });
                        }
                      }}
                      _hover={{
                        bg:
                          newAddressLabel === "Home"
                            ? colorMode === "light"
                              ? colors.light.mainFixed10a
                              : colors.dark.mainFixed10a
                            : colorMode === "light"
                            ? colors.light.bgFourth
                            : colors.dark.bgFourth,
                      }}
                    >
                      Home
                    </Button>

                    {/* Work Button */}
                    <Button
                      flex={1}
                      variant="outline"
                      borderColor={
                        newAddressLabel === "Work"
                          ? colorMode === "light"
                            ? colors.light.mainFixed
                            : colors.dark.mainFixed
                          : colorMode === "light"
                          ? colors.light.border1
                          : colors.dark.border1
                      }
                      bg={
                        newAddressLabel === "Work"
                          ? colorMode === "light"
                            ? colors.light.mainFixed10a
                            : colors.dark.mainFixed10a
                          : "transparent"
                      }
                      color={
                        newAddressLabel === "Work"
                          ? colorMode === "light"
                            ? colors.light.mainFixed
                            : colors.dark.mainFixed
                          : colorMode === "light"
                          ? colors.light.textMain
                          : colors.dark.textMain
                      }
                      borderRadius="12px"
                      onClick={() => {
                        setNewAddressLabel("Work");
                        if (addressErrors.label) {
                          setAddressErrors({ ...addressErrors, label: "" });
                        }
                      }}
                      _hover={{
                        bg:
                          newAddressLabel === "Work"
                            ? colorMode === "light"
                              ? colors.light.mainFixed10a
                              : colors.dark.mainFixed10a
                            : colorMode === "light"
                            ? colors.light.bgFourth
                            : colors.dark.bgFourth,
                      }}
                    >
                      Work
                    </Button>

                    {/* Department Button */}
                    <Button
                      flex={1}
                      variant="outline"
                      borderColor={
                        newAddressLabel === "Department"
                          ? colorMode === "light"
                            ? colors.light.mainFixed
                            : colors.dark.mainFixed
                          : colorMode === "light"
                          ? colors.light.border1
                          : colors.dark.border1
                      }
                      bg={
                        newAddressLabel === "Department"
                          ? colorMode === "light"
                            ? colors.light.mainFixed10a
                            : colors.dark.mainFixed10a
                          : "transparent"
                      }
                      color={
                        newAddressLabel === "Department"
                          ? colorMode === "light"
                            ? colors.light.mainFixed
                            : colors.dark.mainFixed
                          : colorMode === "light"
                          ? colors.light.textMain
                          : colors.dark.textMain
                      }
                      borderRadius="12px"
                      onClick={() => {
                        setNewAddressLabel("Department");
                        if (addressErrors.label) {
                          setAddressErrors({ ...addressErrors, label: "" });
                        }
                      }}
                      _hover={{
                        bg:
                          newAddressLabel === "Department"
                            ? colorMode === "light"
                              ? colors.light.mainFixed10a
                              : colors.dark.mainFixed10a
                            : colorMode === "light"
                            ? colors.light.bgFourth
                            : colors.dark.bgFourth,
                      }}
                    >
                      Department
                    </Button>
                  </HStack>
                  {addressErrors.label && (
                    <Text
                      fontSize="sm"
                      color={
                        colorMode === "light"
                          ? colors.light.error
                          : colors.dark.error
                      }
                    >
                      {addressErrors.label}
                    </Text>
                  )}
                </VStack>
              </GridItem>

              {/* City Input */}
              <GridItem colSpan={{ base: 1, md: 1 }}>
                <VStack align="stretch" spacing={2}>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                >
                  City
                </Text>
                <Input
                  placeholder="Enter city or use current location"
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    if (addressErrors.city) {
                      setAddressErrors({ ...addressErrors, city: "" });
                    }
                  }}
                  bg={
                    colorMode === "light"
                      ? colors.light.bgInput
                      : colors.dark.bgInput
                  }
                  border={
                    addressErrors.city
                      ? `1px solid ${
                          colorMode === "light"
                            ? colors.light.error
                            : colors.dark.error
                        }`
                      : "none"
                  }
                  borderRadius="12px"
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                  _placeholder={{
                    color:
                      colorMode === "light"
                        ? colors.light.textSub
                        : colors.dark.textSub,
                  }}
                />
                {addressErrors.city && (
                  <Text
                    fontSize="sm"
                    color={
                      colorMode === "light"
                        ? colors.light.error
                        : colors.dark.error
                    }
                  >
                    {addressErrors.city}
                  </Text>
                )}
                </VStack>
              </GridItem>

              {/* Area Input */}
              <GridItem colSpan={{ base: 1, md: 1 }}>
                <VStack align="stretch" spacing={2}>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                >
                  Area
                </Text>
                <Input
                  placeholder="Enter area or use current location"
                  value={area}
                  onChange={(e) => {
                    setArea(e.target.value);
                    if (addressErrors.area) {
                      setAddressErrors({ ...addressErrors, area: "" });
                    }
                  }}
                  bg={
                    colorMode === "light"
                      ? colors.light.bgInput
                      : colors.dark.bgInput
                  }
                  border={
                    addressErrors.area
                      ? `1px solid ${
                          colorMode === "light"
                            ? colors.light.error
                            : colors.dark.error
                        }`
                      : "none"
                  }
                  borderRadius="12px"
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                  _placeholder={{
                    color:
                      colorMode === "light"
                        ? colors.light.textSub
                        : colors.dark.textSub,
                  }}
                />
                {addressErrors.area && (
                  <Text
                    fontSize="sm"
                    color={
                      colorMode === "light"
                        ? colors.light.error
                        : colors.dark.error
                    }
                  >
                    {addressErrors.area}
                  </Text>
                )}
                </VStack>
              </GridItem>

              {/* Street Input */}
              <GridItem colSpan={{ base: 1, md: 1 }}>
                <VStack align="stretch" spacing={2}>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                >
                  Street
                </Text>
                <Input
                  placeholder="Enter street or use current location"
                  value={street}
                  onChange={(e) => {
                    setStreet(e.target.value);
                    if (addressErrors.street) {
                      setAddressErrors({ ...addressErrors, street: "" });
                    }
                  }}
                  bg={
                    colorMode === "light"
                      ? colors.light.bgInput
                      : colors.dark.bgInput
                  }
                  border={
                    addressErrors.street
                      ? `1px solid ${
                          colorMode === "light"
                            ? colors.light.error
                            : colors.dark.error
                        }`
                      : "none"
                  }
                  borderRadius="12px"
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                  _placeholder={{
                    color:
                      colorMode === "light"
                        ? colors.light.textSub
                        : colors.dark.textSub,
                  }}
                />
                {addressErrors.street && (
                  <Text
                    fontSize="sm"
                    color={
                      colorMode === "light"
                        ? colors.light.error
                        : colors.dark.error
                    }
                  >
                    {addressErrors.street}
                  </Text>
                )}
                </VStack>
              </GridItem>

              {/* Building Number Input */}
              <GridItem colSpan={{ base: 1, md: 1 }}>
                <VStack align="stretch" spacing={2}>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                >
                  Building Number
                </Text>
                <Input
                  placeholder="e.g., 123"
                  value={buildingNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow only numbers
                    if (value === "" || /^[0-9]+$/.test(value)) {
                      setBuildingNumber(value);
                      if (addressErrors.buildingNumber) {
                        setAddressErrors({ ...addressErrors, buildingNumber: "" });
                      }
                    }
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  bg={
                    colorMode === "light"
                      ? colors.light.bgInput
                      : colors.dark.bgInput
                  }
                  border={
                    addressErrors.buildingNumber
                      ? `1px solid ${
                          colorMode === "light"
                            ? colors.light.error
                            : colors.dark.error
                        }`
                      : "none"
                  }
                  borderRadius="12px"
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                  _placeholder={{
                    color:
                      colorMode === "light"
                        ? colors.light.textSub
                        : colors.dark.textSub,
                  }}
                />
                {addressErrors.buildingNumber && (
                  <Text
                    fontSize="sm"
                    color={
                      colorMode === "light"
                        ? colors.light.error
                        : colors.dark.error
                    }
                  >
                    {addressErrors.buildingNumber}
                  </Text>
                )}
                </VStack>
              </GridItem>

              {/* Floor Input (Optional) */}
              <GridItem colSpan={{ base: 1, md: 1 }}>
                <VStack align="stretch" spacing={2}>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                >
                  Floor (Optional)
                </Text>
                <Input
                  placeholder="e.g., 3"
                  value={floor}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow only numbers
                    if (value === "" || /^[0-9]+$/.test(value)) {
                      setFloor(value);
                    }
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  bg={
                    colorMode === "light"
                      ? colors.light.bgInput
                      : colors.dark.bgInput
                  }
                  border="none"
                  borderRadius="12px"
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                  _placeholder={{
                    color:
                      colorMode === "light"
                        ? colors.light.textSub
                        : colors.dark.textSub,
                  }}
                />
                </VStack>
              </GridItem>

              {/* Apartment Input (Optional) */}
              <GridItem colSpan={{ base: 1, md: 1 }}>
                <VStack align="stretch" spacing={2}>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                >
                  Apartment (Optional)
                </Text>
                <Input
                  placeholder="e.g., 5A"
                  value={apartment}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow numbers and letters (for apartment like 5A, 10B)
                    if (value === "" || /^[0-9A-Za-z]+$/.test(value)) {
                      setApartment(value);
                    }
                  }}
                  type="text"
                  bg={
                    colorMode === "light"
                      ? colors.light.bgInput
                      : colors.dark.bgInput
                  }
                  border="none"
                  borderRadius="12px"
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                  _placeholder={{
                    color:
                      colorMode === "light"
                        ? colors.light.textSub
                        : colors.dark.textSub,
                  }}
                />
                </VStack>
              </GridItem>

              {/* Get Current Location Button */}
              <GridItem colSpan={{ base: 1, md: 1 }}>
                <Button
                  variant="outline"
                  borderColor={
                    latitude && longitude
                      ? colorMode === "light"
                        ? colors.light.mainFixed
                        : colors.dark.mainFixed
                      : colorMode === "light"
                      ? colors.light.border1
                      : colors.dark.border1
                  }
                  bg={
                    latitude && longitude
                      ? colorMode === "light"
                        ? colors.light.mainFixed10a
                        : colors.dark.mainFixed10a
                      : "transparent"
                  }
                  color={
                    latitude && longitude
                      ? colorMode === "light"
                        ? colors.light.mainFixed
                        : colors.dark.mainFixed
                      : colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                  borderRadius="12px"
                  size="lg"
                  h="auto"
                  py={3}
                  px={4}
                  onClick={handleGetCurrentLocation}
                  isLoading={isGettingLocation}
                  loadingText="Getting location..."
                  w="full"
                >
                  <HStack spacing={2} w="full" justify="center">
                    <MapTrifold size={20} weight="fill" />
                    <VStack align="start" spacing={0} flex={1}>
                      <HStack spacing={2}>
                        <Text fontSize="sm" fontWeight="bold">
                          Use Current Location
                        </Text>
                        {!latitude && !longitude && (
                          <Text fontSize="xs" color="inherit">
                            (Optional)
                          </Text>
                        )}
                      </HStack>
                      <Text
                        fontSize="xs"
                        color={
                          colorMode === "light"
                            ? colors.light.textSub
                            : colors.dark.textSub
                        }
                      >
                        {latitude && longitude 
                          ? `✓ Location detected (${latitude.toFixed(6)}, ${longitude.toFixed(6)})` 
                          : "Auto-fill address fields"}
                      </Text>
                    </VStack>
                  </HStack>
                </Button>
              </GridItem>

              {/* Primary Switch */}
              <GridItem colSpan={{ base: 1, md: 1 }}>
                <Button
                variant="outline"
                borderColor={
                  isPrimary
                    ? colorMode === "light"
                      ? colors.light.mainFixed
                      : colors.dark.mainFixed
                    : colorMode === "light"
                    ? colors.light.border1
                    : colors.dark.border1
                }
                bg={
                  isPrimary
                    ? colorMode === "light"
                      ? colors.light.mainFixed10a
                      : colors.dark.mainFixed10a
                    : "transparent"
                }
                color={
                  isPrimary
                    ? colorMode === "light"
                      ? colors.light.mainFixed
                      : colors.dark.mainFixed
                    : colorMode === "light"
                    ? colors.light.textMain
                    : colors.dark.textMain
                }
                borderRadius="12px"
                size="lg"
                h="auto"
                py={3}
                px={4}
                onClick={() => setIsPrimary(!isPrimary)}
                transition="all 0.2s"
                w="full"
              >
                <HStack spacing={3} w="full">
                  <Box
                    w="20px"
                    h="20px"
                    borderRadius="full"
                    border={`2px solid ${
                      isPrimary
                        ? colorMode === "light"
                          ? colors.light.mainFixed
                          : colors.dark.mainFixed
                        : colorMode === "light"
                        ? colors.light.border1
                        : colors.dark.border1
                    }`}
                    bg={
                      isPrimary
                        ? colorMode === "light"
                          ? colors.light.mainFixed
                          : colors.dark.mainFixed
                        : "transparent"
                    }
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                  >
                    {isPrimary && (
                      <Box w="8px" h="8px" borderRadius="full" bg="white" />
                    )}
                  </Box>
                  <VStack align="start" spacing={0} flex={1}>
                    <Text fontSize="sm" fontWeight="bold">
                      Set as Primary Address
                    </Text>
                    <Text
                      fontSize="xs"
                      color={
                        colorMode === "light"
                          ? colors.light.textSub
                          : colors.dark.textSub
                      }
                    >
                      This will be your default delivery address
                    </Text>
                  </VStack>
                </HStack>
                </Button>
              </GridItem>
            </Grid>
          </DialogBody>

          <Separator
            borderColor={
              colorMode === "light"
                ? colors.light.border1
                : colors.dark.border1
            }
          />

          <DialogFooter>
            <HStack spacing={3} w="full">
              <Button
                flex={1}
                variant="outline"
                borderColor={
                  colorMode === "light"
                    ? colors.light.border1
                    : colors.dark.border1
                }
                color={
                  colorMode === "light"
                    ? colors.light.textMain
                    : colors.dark.textMain
                }
                borderRadius="12px"
                onClick={() => {
                  setIsAddressDialogOpen(false);
                  setNewAddressLabel("");
                  setCity("");
                  setArea("");
                  setStreet("");
                  setBuildingNumber("");
                  setFloor("");
                  setApartment("");
                  setIsPrimary(false);
                  setEditingAddressId(null);
                  setAddressErrors({ label: "", city: "", area: "", street: "", buildingNumber: "" });
                }}
                _hover={{
                  bg:
                    colorMode === "light"
                      ? colors.light.bgFourth
                      : colors.dark.bgFourth,
                }}
              >
                Cancel
              </Button>
              <Button
                flex={1}
                bg={
                  colorMode === "light"
                    ? colors.light.mainFixed
                    : colors.dark.mainFixed
                }
                color="white"
                borderRadius="12px"
                _hover={{
                  bg:
                    colorMode === "light"
                      ? colors.light.mainFixed70a
                      : colors.dark.mainFixed70a,
                }}
                onClick={handleSaveAddress}
              >
                {editingAddressId ? "Update" : "Save"}
              </Button>
            </HStack>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );
}
