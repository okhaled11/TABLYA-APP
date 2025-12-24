import { useState } from "react";
import {
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
  VStack,
  Text,
  Button,
  HStack,
  Input,
} from "@chakra-ui/react";
import { useColorMode } from "../../theme/color-mode";
import colors from "../../theme/color";
import { MapTrifold } from "@phosphor-icons/react";
import { toaster } from "../ui/toaster";
import { useDispatch } from "react-redux";
import { setRegistrationAddress } from "../../app/features/Auth/registrationAddressSlice";
import { useTranslation } from "react-i18next";

const AddressDialog = ({
  isOpen,
  onClose,
  onAddressAdded,
  userType = "customer",
}) => {
  const { colorMode } = useColorMode();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [newAddressLabel, setNewAddressLabel] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [street, setStreet] = useState("");
  const [buildingNumber, setBuildingNumber] = useState("");
  const [floor, setFloor] = useState("");
  const [apartment, setApartment] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [addressErrors, setAddressErrors] = useState({
    label: "",
    street: "",
    buildingNumber: "",
    location: "",
  });

  const resetState = () => {
    setNewAddressLabel("");
    setCity("");
    setArea("");
    setStreet("");
    setBuildingNumber("");
    setFloor("");
    setApartment("");
    setLatitude(null);
    setLongitude(null);
    setIsGettingLocation(false);
    setAddressErrors({
      label: "",
      street: "",
      buildingNumber: "",
      location: "",
    });
  };

  const handleGetCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toaster.create({
        title: t("addressDialog.toasts.geolocationNotSupported.title"),
        description: t(
          "addressDialog.toasts.geolocationNotSupported.description"
        ),
        type: "error",
        duration: 3000,
      });
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords;

        try {
          setLatitude(lat);
          setLongitude(lng);

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
            {
              headers: {
                "Accept-Language": "en",
              },
            }
          );
          const data = await response.json();

          if (data && data.address) {
            const address = data.address;

            const cityName =
              address.city ||
              address.town ||
              address.village ||
              address.county ||
              "";
            setCity(cityName);

            let areaName = "";
            const hasNeighbourhood = address.neighbourhood || false;
            const hasResidential = address.residential || false;

            if (hasNeighbourhood && hasResidential) {
              areaName =
                address.suburb || address.district || address.hamlet || "";
            } else if (hasNeighbourhood || hasResidential) {
              areaName = hasNeighbourhood
                ? address.neighbourhood
                : address.residential;
            } else {
              areaName =
                address.suburb || address.district || address.hamlet || "";
            }

            // If no area is found, use city as area
            if (!areaName && cityName) {
              areaName = cityName;
            }
            setArea(areaName);

            let streetName =
              address.road || address.street || address.pedestrian || "";

            if (!streetName) {
              streetName =
                address.footway ||
                address.cycleway ||
                address.path ||
                address.track ||
                address.alley ||
                "";
            }

            if (!streetName) {
              streetName =
                address.amenity ||
                address.shop ||
                address.building ||
                address.tourism ||
                address.leisure ||
                "";
            }

            if (!streetName) {
              streetName = address.highway || address.place || "";
            }

            setStreet(streetName);

            const houseNumber = address.house_number || "";
            setBuildingNumber(houseNumber);

            setAddressErrors((prev) => ({ ...prev, location: "" }));

            toaster.create({
              title: t("addressDialog.toasts.locationSuccess.title"),
              description: `${t(
                "addressDialog.toasts.locationSuccess.description"
              )}: ${cityName || "Unknown city"}`,
              type: "success",
              duration: 3000,
            });
          } else {
            toaster.create({
              title: t("addressDialog.toasts.addressWarning.title"),
              description: t("addressDialog.toasts.addressWarning.description"),
              type: "warning",
              duration: 3000,
            });
          }
        } catch (error) {
          toaster.create({
            title: t("addressDialog.toasts.addressError.title"),
            description: t("addressDialog.toasts.addressError.description"),
            type: "error",
            duration: 3000,
          });
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        setIsGettingLocation(false);
        console.error("❌ Geolocation Error:", error);
        let errorMessage = t("addressDialog.toasts.locationErrors.unknown");

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = t("addressDialog.toasts.locationErrors.denied");
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = t("addressDialog.toasts.locationErrors.unavailable");
            break;
          case error.TIMEOUT:
            errorMessage = t("addressDialog.toasts.locationErrors.timeout");
            break;
          default:
            errorMessage = t("addressDialog.toasts.locationErrors.unknown");
        }

        toaster.create({
          title: t("addressDialog.toasts.addressError.title"),
          description: errorMessage,
          type: "error",
          duration: 3000,
        });
      },
      {
        enableHighAccuracy: false, // Changed to false for faster response
        timeout: 30000, // Increased to 30 seconds
        maximumAge: 60000, // Cache location for 1 minute
      }
    );
  };

  const handleSaveAddress = async () => {
    setAddressErrors({
      label: "",
      street: "",
      buildingNumber: "",
      location: "",
    });

    let hasError = false;
    const errors = { label: "", street: "", buildingNumber: "", location: "" };

    if (!newAddressLabel) {
      errors.label = t("addressDialog.errors.selectLabel");
      hasError = true;
    }

    if (!street.trim()) {
      errors.street = t("addressDialog.errors.enterStreet");
      hasError = true;
    }

    if (!buildingNumber.trim()) {
      errors.buildingNumber = t("addressDialog.errors.enterBuilding");
      hasError = true;
    }

    if (!latitude || !longitude || !city) {
      errors.location = t("addressDialog.errors.useLocation");
      hasError = true;
    }

    if (hasError) {
      setAddressErrors(errors);
      return;
    }

    try {
      const addressData = {
        label: newAddressLabel,
        city: city.trim(),
        area: area.trim(),
        street: street.trim(),
        buildingNumber: buildingNumber.trim(),
        floor: floor.trim(),
        apartment: apartment.trim(),
        latitude,
        longitude,
        isPrimary: false,
      };

      // Save address to Redux state for registration
      dispatch(setRegistrationAddress(addressData));

      toaster.create({
        title: t("addressDialog.toasts.saveSuccess.title"),
        description: t("addressDialog.toasts.saveSuccess.description"),
        type: "success",
        duration: 3000,
      });

      // Call the callback to notify parent component
      if (onAddressAdded) {
        onAddressAdded();
      }

      onClose();
      resetState();
    } catch (error) {
      toaster.create({
        title: t("addressDialog.toasts.saveError.title"),
        description:
          error.message || t("addressDialog.toasts.saveError.description"),
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleClose = () => {
    onClose();
    resetState();
  };

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(e) => {
        if (!e.open) {
          handleClose();
        }
      }}
      size="md"
    >
      <DialogBackdrop bg="blackAlpha.700" backdropFilter="blur(4px)" />
      <DialogContent
        dir={i18n.dir()}
        bg={colorMode === "light" ? colors.light.bgThird : colors.dark.bgThird}
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
            {t(`addressDialog.title.${userType}`)}
          </DialogTitle>
          <Text
            fontSize="sm"
            color={
              colorMode === "light" ? colors.light.textSub : colors.dark.textSub
            }
            mt={1}
          >
            {t("addressDialog.subtitle")}
          </Text>
        </DialogHeader>
        <DialogCloseTrigger />

        <Separator
          borderColor={
            colorMode === "light" ? colors.light.border1 : colors.dark.border1
          }
        />

        <DialogBody py={6}>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={5}>
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
                  {t("addressDialog.labels.label")}
                </Text>
                <HStack spacing={3}>
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
                        setAddressErrors((prev) => ({ ...prev, label: "" }));
                      }
                    }}
                  >
                    {t("addressDialog.labels.home")}
                  </Button>

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
                        setAddressErrors((prev) => ({ ...prev, label: "" }));
                      }
                    }}
                  >
                    {t("addressDialog.labels.work")}
                  </Button>

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
                        setAddressErrors((prev) => ({ ...prev, label: "" }));
                      }
                    }}
                  >
                    {t("addressDialog.labels.department")}
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

            {/* Current Location Button - Full Width */}
            <GridItem colSpan={{ base: 1, md: 2 }}>
              <Button
                w="full"
                leftIcon={<MapTrifold size={20} weight="fill" />}
                bg={
                  colorMode === "light"
                    ? colors.light.mainFixed
                    : colors.dark.mainFixed
                }
                color="white"
                borderRadius="12px"
                onClick={handleGetCurrentLocation}
                isLoading={isGettingLocation}
                loadingText={t("addressDialog.buttons.gettingLocation")}
                _hover={{
                  bg:
                    colorMode === "light"
                      ? colors.light.mainFixed
                      : colors.dark.mainFixed,
                  opacity: 0.9,
                }}
              >
                {t("addressDialog.buttons.useLocation")}
              </Button>
              {addressErrors.location && (
                <Text
                  fontSize="sm"
                  color={
                    colorMode === "light"
                      ? colors.light.error
                      : colors.dark.error
                  }
                  mt={2}
                >
                  {addressErrors.location}
                </Text>
              )}
            </GridItem>

            {/* City - Disabled */}
            <GridItem>
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
                  {t("addressDialog.labels.city")}
                </Text>
                <Input
                  value={city}
                  disabled
                  placeholder="Auto-filled from location"
                  bg={
                    colorMode === "light"
                      ? colors.light.bgFourth
                      : colors.dark.bgFourth
                  }
                  borderRadius="12px"
                />
              </VStack>
            </GridItem>

            {/* Area - Disabled */}
            <GridItem>
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
                  {t("addressDialog.labels.area")}
                </Text>
                <Input
                  value={area}
                  disabled
                  placeholder="Auto-filled from location"
                  bg={
                    colorMode === "light"
                      ? colors.light.bgFourth
                      : colors.dark.bgFourth
                  }
                  borderRadius="12px"
                />
              </VStack>
            </GridItem>

            {/* Street */}
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
                  {t("addressDialog.labels.street")}
                </Text>
                <Input
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder={t("addressDialog.placeholders.street")}
                  borderRadius="12px"
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

            {/* Building Number */}
            <GridItem>
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
                  {t("addressDialog.labels.buildingNo")}
                </Text>
                <Input
                  value={buildingNumber}
                  onChange={(e) => setBuildingNumber(e.target.value)}
                  placeholder={t("addressDialog.placeholders.building")}
                  borderRadius="12px"
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

            {/* Floor */}
            <GridItem>
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
                  {t("addressDialog.labels.floor")}
                </Text>
                <Input
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  placeholder={t("addressDialog.placeholders.floor")}
                  borderRadius="12px"
                />
              </VStack>
            </GridItem>

            {/* Apartment */}
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
                  {t("addressDialog.labels.apartment")}
                </Text>
                <Input
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  placeholder={t("addressDialog.placeholders.apartment")}
                  borderRadius="12px"
                />
              </VStack>
            </GridItem>
          </Grid>
        </DialogBody>

        <DialogFooter
          borderTopWidth="1px"
          borderColor={
            colorMode === "light" ? colors.light.border1 : colors.dark.border1
          }
          pt={4}
        >
          <HStack justify="flex-end" w="full" spacing={3}>
            <Button variant="ghost" onClick={handleClose}>
              {t("addressDialog.buttons.cancel")}
            </Button>
            <Button
              bg={
                colorMode === "light"
                  ? colors.light.mainFixed
                  : colors.dark.mainFixed
              }
              color="white"
              borderRadius="12px"
              onClick={handleSaveAddress}
              _hover={{
                bg:
                  colorMode === "light"
                    ? colors.light.mainFixed
                    : colors.dark.mainFixed,
                opacity: 0.9,
              }}
            >
              {t("addressDialog.buttons.save")}
            </Button>
          </HStack>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default AddressDialog;
