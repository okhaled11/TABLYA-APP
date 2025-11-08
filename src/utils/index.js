import { toaster } from "../components/ui/toaster";

export const addItemToShoppingCart = (
  cartItem = {},
  shoppingCartItems = []
) => {
  const existingCartItem = shoppingCartItems.find(
    (item) => item.id === cartItem.id
  );
  if (existingCartItem) {
    toaster.create({
      title: "Added to your cart",
      description: `This item is already exists, the quantity will be increased.`,
      type: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
    return shoppingCartItems.map((item) =>
      item.id === cartItem.id ? { ...item, quantity: item.quantity + cartItem.quantity } : item
    );
  }
  toaster.create({
    title: "Added to your cart",
    type: "success",
    duration: 3000,
    isClosable: true,
    position: "top",
  });
  return [...shoppingCartItems, cartItem];
};

// to split review date
export const formatDate = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); 
  const year = date.getFullYear();
  return { day, month, year };
};