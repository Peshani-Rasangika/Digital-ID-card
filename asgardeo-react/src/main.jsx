import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AuthProvider } from "@asgardeo/auth-react";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider
      config={{
        baseUrl: "https://api.asgardeo.io/t/idcardapp",
        clientID: "jMAStrEZ0CC6thhUvoVUfaX6kBga",
        signInRedirectURL: "http://localhost:5173",
        signOutRedirectURL: "http://localhost:5173",
        scope: [
          "openid",
          "profile",
          "email",
          "groups",
          "roles",
          "internal_guest_mgt_invite_add",
        ],
        resourceServerURLs: [
          "http://localhost:5173",
          "https://api.asgardeo.io/t/idcardapp",
        ],
      }}
    >
      <App />
    </AuthProvider>
  </StrictMode>
);
