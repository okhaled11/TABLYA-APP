import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider } from "./theme/color-mode.jsx";
import { Provider } from "react-redux";
import { store } from "./app/store.js";
import { BrowserRouter } from "react-router-dom";
import "./i18n";
import InternetConnectionProvider from "./shared/InternetConnectionProvider.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <InternetConnectionProvider>
        <BrowserRouter>
          <ChakraProvider value={defaultSystem}>
            <ColorModeProvider>
              <App />
            </ColorModeProvider>
          </ChakraProvider>
        </BrowserRouter>
      </InternetConnectionProvider>
    </Provider>
  </StrictMode>
);
