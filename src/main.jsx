import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider } from "./theme/color-mode.jsx";
// import { Provider } from "react-redux";
// import { store } from "./app/store.js";
import { BrowserRouter } from "react-router-dom";
import "./i18n";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <Provider store={store}> */}
      <BrowserRouter>
        <ChakraProvider value={defaultSystem}>
          <ColorModeProvider>
            <App />
          </ColorModeProvider>
        </ChakraProvider>
      </BrowserRouter>
    {/* </Provider> */}
  </StrictMode>
);
