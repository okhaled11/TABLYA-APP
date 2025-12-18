import { Breadcrumb, Flex, Icon, IconButton } from "@chakra-ui/react";
import { FiArrowLeft } from "react-icons/fi";
import { LuChefHat, LuHouse, LuShirt } from "react-icons/lu";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ChefProfileCard from "../../../components/customer/ChefProfileCard";
import { useGetCookerByIdQuery } from "../../../app/features/Customer/CookersApi";
import ChefProfileCardSkeleton from "../../../components/ui/ChefProfileSkeleton";
import ChefMenuSection from "../../../components/customer/ChefMenuSection";
import CustomerReviewSection from "../../../components/customer/CustomerReviewSection";

const ChefMenuProfile = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { data: cooker, error, isLoading } = useGetCookerByIdQuery(id);
  const navigate = useNavigate();
  console.log(id);
  console.log("from id cooker", cooker);

  return (
    <>
      <Breadcrumb.Root>
        <Flex mb={4} align="center">
          <IconButton
            onClick={() => navigate(-1)}
            variant="ghost"
            aria-label="Back"
            colorScheme="gray"
            size={{ base: "md", md: "lg" }}
            alignSelf={{ base: "flex-start", md: "center" }}
          >
            <Icon as={FiArrowLeft} boxSize={5} />
          </IconButton>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link as={Link} to="/home">
                <LuHouse />
                {t("chefMenuProfile.home")}
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />

            <Breadcrumb.Item>
              <Breadcrumb.CurrentLink>
                <Flex align="center" gap={1}>
                  <LuChefHat />
                  {t("chefMenuProfile.title")}
                </Flex>
              </Breadcrumb.CurrentLink>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
          </Breadcrumb.List>
        </Flex>
      </Breadcrumb.Root>
      {isLoading ? (
        <ChefProfileCardSkeleton />
      ) : error ? (
        <div>{t("chefMenuProfile.error")}</div>
      ) : (
        <ChefProfileCard {...cooker} />
      )}
      <ChefMenuSection isAvailable={cooker?.is_available} isBusy={cooker?.is_busy} />
      <CustomerReviewSection />
    </>
  );
};

export default ChefMenuProfile;
