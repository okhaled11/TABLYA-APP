import { toaster } from "../components/ui/toaster";

export const addItemToShoppingCart = (
  cartItem = {},
  shoppingCartItems = []
) => {
  const existingCartItem = shoppingCartItems.find(
    (item) => item.id === cartItem.id
  );

  if (existingCartItem) {
    // Check if we can add more (don't exceed stock)
    const maxStock = cartItem.stock || existingCartItem.stock || 0;
    const newQuantity = existingCartItem.quantity + 1;

    if (newQuantity > maxStock) {
      toaster.create({
        title: "Cannot add more",
        description: `Maximum stock reached for this item.`,
        type: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return shoppingCartItems;
    }

    toaster.create({
      title: "Added to your cart",
      description: `This item is already exists, the quantity will be increased.`,
      type: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
    return shoppingCartItems.map((item) =>
      item.id === cartItem.id ? { ...item, quantity: newQuantity } : item
    );
  }

  toaster.create({
    title: "Added to your cart",
    type: "success",
    duration: 3000,
    isClosable: true,
    position: "top",
  });
  // Use the quantity from cartItem, or default to 1 if not provided
  return [
    ...shoppingCartItems,
    { ...cartItem, quantity: cartItem.quantity || 1 },
  ];
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

// detect language on add meal
export const detectLang = (text) => {
  if (!text) return "en";
  let ar = 0;
  let lat = 0;
  for (const ch of text) {
    const code = ch.codePointAt(0);
    // Arabic letters ranges (excluding digits):
    const isArabic =
      (code >= 0x0600 && code <= 0x06ff) || // Arabic
      (code >= 0x0750 && code <= 0x077f) || // Arabic Supplement
      (code >= 0x08a0 && code <= 0x08ff) || // Arabic Extended-A
      (code >= 0xfb50 && code <= 0xfdff) || // Arabic Presentation Forms-A
      (code >= 0xfe70 && code <= 0xfeff); // Arabic Presentation Forms-B

    // Basic Latin letters A-Z / a-z
    const isLatin =
      (code >= 0x0041 && code <= 0x005a) || // A-Z
      (code >= 0x0061 && code <= 0x007a); // a-z

    if (isArabic) ar++;
    else if (isLatin) lat++;
  }
  if (ar > lat) return "ar";
  if (lat > ar) return "en";
  // fallback: prefer Arabic if any Arabic letters exist, else English
  return ar > 0 ? "ar" : "en";
};

// truncate text
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};
