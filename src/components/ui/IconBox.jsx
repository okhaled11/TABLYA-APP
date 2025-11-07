import { Box } from "@chakra-ui/react";
import { useColorMode } from "../../theme/color-mode";
import colors from "../../theme/color";

export default function IconBox({ icon, size = 28, ...props }) {
  const Icon = icon;
  const { colorMode } = useColorMode();

  return (
    <Box
      bg={colorMode === "light" ? colors.light.mainFixed10a : colors.dark.mainFixed10a}
      borderRadius="12px"
      p={3}
      display="flex"
      alignItems="center"
      justifyContent="center"
      {...props}
    >
      <Icon
        size={size}
        weight="fill"
        color={colorMode === "light" ? colors.light.mainFixed : colors.dark.mainFixed}
      />
    </Box>
  );
}
