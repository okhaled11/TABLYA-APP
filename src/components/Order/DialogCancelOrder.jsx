<DialogRoot open={isOpen} onOpenChange={onOpenChange}>
    <DialogTrigger asChild>{children}</DialogTrigger>

    <DialogContent
        maxW={{ base: "90%", md: "500px" }}
        w="full"
        m={0}
        placement="center"
        motionPreset="slide-in-bottom"
        bg={colorMode === "light" ? "white" : colors.dark.bgThird}
        rounded="xl"
        shadow="xl"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={5}
    >
        <DialogHeader>
            <DialogTitle fontSize={{ base: "lg", md: "xl" }} fontWeight="bold">
                Cancel Order?
            </DialogTitle>
            <DialogCloseTrigger />
        </DialogHeader>

        <DialogBody>
            <Text
                fontSize={{ base: "sm", md: "md" }}
                color={
                    colorMode === "light"
                        ? colors.light.textSub
                        : colors.dark.textSub
                }
            >
                Are you sure you want to cancel this order? This action cannot be undone.
            </Text>
        </DialogBody>

        <DialogFooter>
            <DialogActionTrigger asChild>
                <Button variant="outline" mr={3}>
                    No, Keep Order
                </Button>
            </DialogActionTrigger>
            <Button
                bg={
                    colorMode === "light"
                        ? colors.light.mainFixed
                        : colors.dark.mainFixed
                }
                color="white"
                onClick={onConfirm}
                isLoading={isLoading}
                loadingText="Cancelling..."
                _hover={{ opacity: 0.8 }}
            >
                Yes, Cancel Order
            </Button>
        </DialogFooter>
    </DialogContent>
</DialogRoot>
