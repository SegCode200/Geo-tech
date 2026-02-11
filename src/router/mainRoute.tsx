import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../components/layouts/DashboardLayout";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import Home from "../pages/HomePage";
import Overview from "../pages/dashboard/OverView";
import LandRegistration from "../pages/dashboard/LandRegistration";
import EditLand from "../pages/dashboard/EditLand";
import LandSearch from "../pages/dashboard/LandSearch";
import OwnerShipTransfer from "../pages/dashboard/OwnerShipTransfer";
import OwnerShipTransferDetails from "../pages/dashboard/OwnerShipTransferDetails";
import { OwnershipTransferOTPVerification } from "../pages/dashboard/OwnershipTransferOTPVerification";
import { OwnershipTransferDocuments } from "../pages/dashboard/OwnershipTransferDocuments";
import { OwnershipTransferProgress } from "../pages/dashboard/OwnershipTransferProgress";
import COFAApplication from "../pages/dashboard/COFAApplication";
import UserManagement from "../pages/dashboard/UserManagement";
import COFAList from "../pages/dashboard/ListOFLands";
import COFapplicationList from "../pages/dashboard/ListofCOOApplication";
import COFOPayment from "../pages/dashboard/CofOPayment";
import VerifyEmail from "../pages/auth/VerifyEmail";
import DirectToMail from "../pages/auth/DirectToMail";
import ProtectedRoute from "../components/static/ProtectedRoute";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import ResubmitCofO from "../pages/dashboard/ResubmitCofO";
import CofoDetails from "../pages/dashboard/CofoDetails";

const mainRoute = createBrowserRouter([
  {
    path: "/", // Route for the registration page
    element: <Home />, // Render the Register component
    index: true,
  },
  {
    path: "/dashboard",
    element: 
    <ProtectedRoute>
    <DashboardLayout />
    </ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Overview />,
      },

      {
        path: "land-registration",
        element: <LandRegistration />,
      },
      {
        path: "edit-land/:id",
        element: <EditLand />,
      },
      {
        path: "list-of-registrations",
        element: <COFAList />,
      },
      {
        path: "land-search",
        element: <LandSearch />,
      },
      {
        path: "ownership-transfer",
        element: <OwnerShipTransfer />,
      },
      {
        path: "ownership-transfer/:transferId",
        element: <OwnerShipTransferDetails />,
      },
      {
        path: "ownership-transfer/:transferId/otp",
        element: <OwnershipTransferOTPVerification />,
      },
      {
        path: "ownership-transfer/:transferId/documents",
        element: <OwnershipTransferDocuments />,
      },
      {
        path: "ownership-transfer/:transferId/progress",
        element: <OwnershipTransferProgress />,
      },
      {
        path: "c-of-o-application",
        element: <COFAApplication />,
      },
      {
        path: "list-c-of-o-application",
        element: <COFapplicationList />,
      },
      {
        path: "cofo-payment",
        element: <COFOPayment />,
      },
      {
        path: "user-management",
        element: <UserManagement />,
      },
      {
        path: "c-of-o/resubmit/:id",
        element: <ResubmitCofO />,
      },
      {
        path: "c-of-o/:id",
        element: <CofoDetails />,
      },
      {
        path: "cofo-details/:id",
        element: <CofoDetails />,
      }
    ],
  },
  {
    path: "/auth/register", // Route for the registration page
    element: <Register />, // Render the Register component
  },
  {
    path: "/auth/login", // Route for the login page
    element: <Login />, // Render the Login component
  },
  {
    path: "/auth/forgot-password", // Route for the forgot password page
    element: <ForgotPassword />, // Render the ForgotPassword component
  },
  {
    path: "/auth/reset-password", // Route for the reset password page with token
    element: <ResetPassword />, // Render the ResetPassword component
  },
  {
    path: "/auth/verify-email", // Route for the email verification page
    element: <VerifyEmail />, // Render the VerifyEmail component
  },
  {
    path: "/auth/check-mail", // Route for the check mail page
    element: <DirectToMail />, // Render the DirectToMail component
  }
]);

export default mainRoute;
