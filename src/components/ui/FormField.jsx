import { VStack, Text, Input } from "@chakra-ui/react";
import { useColorStyles } from "../../hooks/useColorStyles";

export default function FormField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  error,
  ...props
}) {
  const styles = useColorStyles();

  return (
    <VStack align="stretch" spacing={2}>
      {label && (
        <Text fontSize="sm" fontWeight="medium" color={styles.textMain}>
          {label}
        </Text>
      )}
      <Input
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
        bg={styles.bgInput}
        border={error ? `1px solid ${styles.error}` : "none"}
        borderRadius="12px"
        color={styles.textMain}
        _placeholder={{ color: styles.textSub }}
        {...props}
      />
      {error && (
        <Text fontSize="xs" color={styles.error}>
          {error}
        </Text>
      )}
    </VStack>
  );
}
