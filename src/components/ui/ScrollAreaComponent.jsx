import { Box, Flex, Text, ScrollArea } from "@chakra-ui/react";
const ScrollAreaComponent = ({ children }) => {
  return (
    <ScrollArea.Root height="15rem">
      <ScrollArea.Viewport
        css={{
          "--scroll-shadow-size": "4rem",
          maskImage:
            "linear-gradient(#000,#000,transparent 0,#000 var(--scroll-shadow-size),#000 calc(100% - var(--scroll-shadow-size)),transparent)",
          "&[data-at-top]": {
            maskImage:
              "linear-gradient(180deg,#000 calc(100% - var(--scroll-shadow-size)),transparent)",
          },
          "&[data-at-bottom]": {
            maskImage:
              "linear-gradient(0deg,#000 calc(100% - var(--scroll-shadow-size)),transparent)",
          },
        }}
      >
        <ScrollArea.Content spaceY="4" mt={7}>
          {children}
          {/* content */}
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar>
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
};

export default ScrollAreaComponent;
