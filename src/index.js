import "./input.css";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import store, { persistor } from "./store";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { PersistGate } from "redux-persist/integration/react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
// import customTranslateBackend from './helper/customTranslateBackend'; // Import your custom backend module

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    lng: "en",
    debug: false,
    react: {
      useSuspense: false,
    },
    backend: {
      loadPath: `${process.env.PUBLIC_URL || ''}/locales/{{lng}}/{{ns}}.json`,
    },
    interpolation: {
      escapeValue: false,
    },
  });
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <BrowserRouter
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}
  >
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
        <Toaster />
      </PersistGate>
    </Provider>
  </BrowserRouter>
  // </React.StrictMode>
);
