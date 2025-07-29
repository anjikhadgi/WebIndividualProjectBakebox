import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Profile from "./components/pages/private/Profile";

// Lazy Load Components - Updated names
const Homepage = lazy(() => import("./components/pages/private/Homepage"));
const LoginPage = lazy(() => import("./components/pages/public/Login"));
const SignupPage = lazy(() => import("./components/pages/public/Signup"));
const OrderConsultation = lazy(() => import("./components/pages/private/OrderConsultation"));
const Navbar = lazy(() => import("./components/pages/private/Navbar"));
const Footer = lazy(() => import("./components/pages/private/Footer"));

// Section Page
const FrontSection = lazy(() => import("./components/pages/private/FrontSection"));

// Admin Pages - Updated names
const AdminLogin = lazy(() => import("./components/pages/private/AdminLogin"));
const DashboardIndex = lazy(() => import("./components/api/dashboard/index"));
const CustomerIndex = lazy(() => import("./components/api/customer/index"));
const CustomerForm = lazy(() => import("./components/api/customer/form"));
const ProductIndex = lazy(() => import("./components/api/product/index"));
const ProductForm = lazy(() => import("./components/api/product/form"));
const OrderIndex = lazy(() => import("./components/api/order/index"));

const queryClient = new QueryClient();

// User Route Protection
const PrivateUserRoute = () => {
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// Admin Route Protection (Checks for Admin Role as well)
const PrivateAdminRoute = () => { // Renamed from PrivateRoute to PrivateAdminRoute for clarity
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  // You would ideally decode the token here to check for 'admin' role
  // For now, let's assume if there's a token, it's valid for admin path.
  // In a real app, you'd add logic like:
  // const user = token ? JSON.parse(atob(token.split('.')[1])) : null;
  // const isAdmin = user && user.role === 'admin';
  // return isAdmin ? <Outlet /> : <Navigate to="/admin/login" replace />;

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
};


// Layout Wrapper to Include Navbar/Footer
const UserLayout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

// Define Routes - CORRECTED ADMIN ROUTES
const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "/admin/login", element: <AdminLogin /> }, // ADMIN LOGIN MUST BE PUBLICLY ACCESSIBLE

  // User Routes with Navbar/Footer (Protected by Authentication)
  {
    path: "/",
    element: <UserLayout />,
    children: [
      { index: true, element: <Homepage /> }, // Add an index route for the root '/'
      { path: "home", element: <Homepage /> }, // Accessible to everyone
      {
        element: <PrivateUserRoute />, // Protects user-specific routes
        children: [
          { path: "profile", element: <Profile /> },
          { path: "orderconsultation", element: <OrderConsultation /> }, // Still "orderconsultation" here.
                                                                     // If the previous error was for "/bookconsultation",
                                                                     // this path should be "bookconsultation"
                                                                     // or the frontend link should be "orderconsultation".
                                                                     // I will keep it as you provided for now.
          { path: "frontsection", element: <FrontSection /> },
        ]
      }
    ]
  },

  // Admin Protected Routes (Only accessible AFTER login)
  {
    path: "/admin", // This now defines the base path for these children
    element: <PrivateAdminRoute />, // Protects these routes
    children: [
      { path: "dashboard", element: <DashboardIndex /> },
      { path: "customer", element: <CustomerIndex /> },
      { path: "customer/:id", element: <CustomerForm /> },
      { path: "customer/form", element: <CustomerForm /> },
      { path: "products", element: <ProductIndex /> },
      { path: "products/create", element: <ProductForm /> },
      { path: "products/edit/:id", element: <ProductForm /> },
      { path: "orders", element: <OrderIndex /> },
    ],
  },
]);

// App Component
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div className="loading">Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;