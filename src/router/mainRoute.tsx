import { createBrowserRouter } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import NewRentalUnit from '../pages/NewRentalUnit'; // Import the new page
import Register from '../pages/auth/Register';
import Login from '../pages/auth/Login';
import Home from '../pages/HomePage';
import Overview from '../pages/dashboard/OverView';
import LandRegistration from '../pages/dashboard/LandRegistration';
import LandSearch from '../pages/dashboard/LandSearch';
import OwnerShipTransfer from '../pages/dashboard/OwnerShipTransfer';
import COFAApplication from '../pages/dashboard/COFAApplication';
import UserManagement from '../pages/dashboard/UserManagement';
import COFAList from '../pages/dashboard/ListofCOO';
import COFAApplicationEdit from '../pages/dashboard/EditCOfApplication';
import COFapplicationList from '../pages/dashboard/ListofCOOApplication';
import AuthPage from '../pages/auth/AuthPage';
import COFOPayment from '../pages/dashboard/CofOPayment';

const mainRoute = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Overview />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
      {
        path: '/rental-units', // Route for New Rental Unit
        element: <NewRentalUnit />,
      },
  
      {
        path: '/land-registration',
        element: <LandRegistration />,
      },
      {
        path: '/list-of-registrations',
        element: <COFAList />,
      },
      {
        path: '/land-search',
        element: <LandSearch />,
      },
      {
        path: '/ownership-transfer',
        element: <OwnerShipTransfer />,
      },
      {
        path: '/c-of-o-application',
        element: <COFAApplication />,
      },
      {
        path: '/list-c-of-o-application',
        element: <COFapplicationList />,
      },
      {
        path: '/cofo-payment',
        element: <COFOPayment />,
      },
      {
        path: '/edit-c-of-o-application',
        element: <COFAApplicationEdit />,
      },
      {
        path: '/user-management',
        element: <UserManagement />,
      },
    ],
  }
  ,
  {
    path: '/register', // Route for the registration page
    element: <Register />, // Render the Register component
  },
  {
    path: '/login', // Route for the registration page
    element: <Login />, // Render the Register component
  },
  {
    path: '/auth', // Route for the registration page
    element: <AuthPage />, // Render the Register component
  },
  {
    path: '/home', // Route for the registration page
    element: <Home />, // Render the Register component
  },
]);

export default mainRoute;