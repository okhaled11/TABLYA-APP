// // src/components/admin/AdminNavBar.jsx
import { Flex, Text, Avatar, Spacer, Box } from "@chakra-ui/react";
// import { Avatar } from "@chakra-ui/react";

export default function AdminNavBar() {
  return (
    <Box style={{ background: "white", padding: "10px" }}>
      <Flex justify="flex-end" marginInlineEnd={"5"}>
        <Avatar.Root>
          <Avatar.Fallback name="User Name" />
          <Avatar.Image src="https://bit.ly/broken-link" />
        </Avatar.Root>
      </Flex>
    </Box>
  );
}
