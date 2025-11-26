import {
  Breadcrumb,
  Flex,
  Icon,
  IconButton,
  Skeleton,
  SkeletonText,
  Box,
  Container,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { FiArrowLeft } from "react-icons/fi";
import { LuChefHat, LuHouse, LuShirt } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MealDetailsCard from "../../../components/customer/Order/MealDetailsCard";
import { useGetMealAndChefDetailsQuery } from "../../../../app/features/Customer/Orders/OrdersApiCustomerSlice";
const MealDetails = () => {
  /* ---------------------hooks-------------------- */
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { chefId, mealId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetMealAndChefDetailsQuery(
    { mealId, chefId },
    { skip: !mealId || !chefId }
  );
  console.log(mealId);

  return (
    <>
      <Breadcrumb.Root>
        <Flex mb={4} align="center" dir={isRTL ? 'rtl' : 'ltr'}>
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
                {t('customer.breadcrumb.home')}
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />

            <Breadcrumb.Item>
              <Breadcrumb.CurrentLink>
                <Flex align="center" gap={1}>
                  <LuChefHat />
                  {t('mealDetails.title')}
                </Flex>
              </Breadcrumb.CurrentLink>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
          </Breadcrumb.List>
        </Flex>
      </Breadcrumb.Root>
      {isLoading ? (
        <Container maxW="container.xl" py={{ base: 4, md: 6 }}>
          <Flex
            direction={{ base: "column", lg: "row" }}
            gap={{ base: 4, lg: 6 }}
            alignItems="stretch"
          >
            {/* Skeleton for Image */}
            <Box flex="1" maxW={{ base: "100%", lg: "550px" }}>
              <Skeleton
                height={{ base: "350px", md: "530px" }}
                borderRadius="3xl"
              />
            </Box>

            {/* Skeleton for Details */}
            <Box flex="1">
              <VStack align="stretch" gap={4}>
                <Skeleton height="40px" width="70%" />
                <SkeletonText noOfLines={3} gap={2} />
                <Skeleton height="50px" width="40%" />
                <Skeleton height="1px" />
                <HStack justify="space-between">
                  <Skeleton height="30px" width="100px" />
                  <Skeleton height="40px" width="150px" />
                </HStack>
                <Skeleton height="80px" borderRadius="xl" />
                <HStack gap={4}>
                  <Skeleton height="50px" flex="1" borderRadius="xl" />
                  <Skeleton height="50px" flex="1" borderRadius="xl" />
                </HStack>
              </VStack>
            </Box>
          </Flex>
        </Container>
      ) : error ? (
        <div>{t('common.errorLoading')}</div>
      ) : data ? (
        <MealDetailsCard mealData={data.meal} chefData={data.chef} />
      ) : null}
    </>
  );
};

export default MealDetails;
