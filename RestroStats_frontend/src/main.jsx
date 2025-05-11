import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import App from './App.jsx'
import Home from './components/Home.jsx';
import ErrorPage from './components/ErrorPage.jsx';
import NewBill from './components/NewBillPage.jsx';
import PaymentHistory from './components/PaymentHistory.jsx';
import Upload_Data from './components/Upload_Data.jsx';
import ViewMenu_1 from './components/ViewMenu_1.jsx';
import UpdateMenu from './components/UpdateMenu.jsx';
import ViewBill from './components/ViewBill.jsx';
import ViewMenu from './components/ViewMenu.jsx';
import ChartSales from './components/ChartSales.jsx';
import Login from './components/Login.jsx';
import RestroStatLandingPage from './components/RestroStatLandingPage.jsx';
import VerticalNavbar from './components/VerticalNavbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import RestaurantDashboard from './components/RestaurantDashboard.jsx';
import RestaurantLoginForm from './components/RestaurantLoginForm.jsx';
import Register from './components/Register.jsx';
import AccountInfo from './components/AccountInfo.jsx';
import PrintBill from './components/PrintBill.jsx';
import DashboardLayout from './components/DashboardLayout.jsx';

// Layout component with Navbar
// const NavbarLayout = () => {
//   return (
//     <>
//       <VerticalNavbar />
//       <Outlet />
//     </>
//   );
// };

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <RestroStatLandingPage />
      },
      {
        path: "/",
        element: <DashboardLayout />, // <-- Use new layout here!
        children: [
          { path: "/dashboard", element: <Home /> },
          { path: "/charts", element: <ChartSales /> },
          { path: "/newbill", element: <NewBill /> },
          { path: "/paymenthistory", element: <PaymentHistory /> },
          { path: "/updatemenu", element: <UpdateMenu /> },
          { path: "/upload", element: <Upload_Data /> },
          { path: "/viewbill", element: <ViewBill /> },
          { path: "/viewmenu", element: <ViewMenu /> },
          { path: "/view_menu", element: <ViewMenu_1 /> },
          { path: "/accountinfo", element: <AccountInfo /> },
          { path: "/printbill", element: <PrintBill /> },
        ]
      },
      // Pages WITHOUT navbar
      { path: "/login", element: <Login /> },
      { path: "/sidebar", element: <div className="flex"><Sidebar /><div className="flex-1 p-4"><h1 className="text-2xl font-bold">YouTube-like Page</h1></div></div> },
      { path: "/signup", element: <Register /> },
      { path: "/maindashboard", element: <RestaurantDashboard /> },
      { path: "/mainlogin", element: <RestaurantLoginForm /> },
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)