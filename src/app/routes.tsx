import { createBrowserRouter } from "react-router";
import { SiteLayout } from "../components/layout/SiteLayout";
import { HomePage } from "../pages/Home/HomePage";
import { ServicesPage } from "../pages/Services/ServicesPage";
import { TrackingPage } from "../pages/Tracking/TrackingPage";
import { AboutPage } from "../pages/About/AboutPage";
import { LoginPage, RegisterPage } from "../pages/Auth/AuthPages";
import { AccountPage } from "../pages/Account/AccountPage";
import { NotFoundPage } from "../pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: SiteLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "layanan", Component: ServicesPage },
      { path: "tracking", Component: TrackingPage },
      { path: "tentang", Component: AboutPage },
      { path: "login", Component: LoginPage },
      { path: "register", Component: RegisterPage },
      { path: "akun", Component: AccountPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
