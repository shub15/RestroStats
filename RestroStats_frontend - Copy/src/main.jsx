import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import App from './App.jsx'
import Home from './components/Home.jsx';
import ErrorPage from './components/ErrorPage.jsx';
import NewBill from './components/NewBillPage.jsx';
import PaymentHistory from './components/PaymentHistory.jsx';
// import { UpdateMenu, ViewBill, ViewMenu } from './utils/Components.jsx';
import Upload_Data from './components/Upload_Data.jsx';
import ViewMenu_1 from './components/ViewMenu_1.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/newbill",
        element: <NewBill />
      },
      {
        path: "/paymenthistory",
        element: <PaymentHistory />
      },
      {
        path: "/updatemenu",
        // element: <UpdateMenu />
      },
      {
        path: "/upload",
        element: <Upload_Data />
      },
      {
        path: "/viewbill",
        // element: <ViewBill />
      },
      {
        path: "/viewmenu",
        // element: <ViewMenu />
      },
      {
        path: "/view_menu",
        element: <ViewMenu_1 />
      },
      // {
      //   path: "/admin/login",
      //   element: <AdminLogin />
      // },
      // {
      //   path: "/admin",
      //   element: <PrivateRoute><Admin /></PrivateRoute>,
      //   children: [
      //     {
      //       path: "",
      //       element: <CollegeForm />
      //     },
      //     {
      //       path: "edit",
      //       element: <EditCollege />
      //     },
      //     {
      //       path: "editform",
      //       element: <EditCollegeForm />
      //     },
      //     {
      //       path: "notifications",
      //       element: <NotificationForm />
      //     }
      //   ]
      // }
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
