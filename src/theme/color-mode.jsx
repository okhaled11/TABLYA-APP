import { createContext, useContext, useEffect, useState } from "react";

const ColorModeContext = createContext();

export function ColorModeProvider({ children }) {
  const [colorMode, setColorMode] = useState(() => {
    const stored = localStorage.getItem("chakra-ui-color-mode");
    return stored || "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(colorMode);
    localStorage.setItem("chakra-ui-color-mode", colorMode);
  }, [colorMode]);

  const toggleColorMode = () => {
    setColorMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ColorModeContext.Provider value={{ colorMode, setColorMode, toggleColorMode }}>
      {children}
    </ColorModeContext.Provider>
  );
}

export function useColorMode() {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error("useColorMode must be used within ColorModeProvider");
  }
  return context;
}
