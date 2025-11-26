import { EmptyState, VStack } from "@chakra-ui/react";
import { LuShoppingCart } from "react-icons/lu";
import { useTranslation } from "react-i18next";

const EmptyCartStatus = () => {
  const { t } = useTranslation();
  return (
    <EmptyState.Root size="lg">
      <EmptyState.Content>
        <EmptyState.Indicator>
          <LuShoppingCart />
        </EmptyState.Indicator>
        <VStack textAlign="center">
          <EmptyState.Title>{t('cart.emptyCartTitle')}</EmptyState.Title>
          <EmptyState.Description>
            {t('cart.emptyCartDescription')}
          </EmptyState.Description>
        </VStack>
      </EmptyState.Content>
    </EmptyState.Root>
  );
};
export default EmptyCartStatus;
