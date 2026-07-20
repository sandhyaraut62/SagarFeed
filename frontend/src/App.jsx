import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import "./dashboard.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { FarmerSupportContentProvider } from "./context/FarmerSupportContentContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Layout from "./components/Layout.jsx";
import DashboardShell from "./components/dashboard/DashboardShell.jsx";
import {
  DashboardIcon,
  OrdersIcon,
  InventoryIcon,
  DeliveriesIcon,
  CustomersIcon,
  TrainingIcon,
  VetIcon,
  SubsidyIcon,
  DealersIcon,
  AccountsIcon,
} from "./components/dashboard/icons.jsx";

import AboutPage from "./pages/AboutPage.jsx";
import CollaborationPage from "./pages/CollaborationPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import FarmerPage from "./pages/FarmerPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import NetworkPage from "./pages/NetworkPage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import SocialResponsibilityPage from "./pages/SocialResponsibilityPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import TermsPage from "./pages/TermsPage.jsx";
import PrivacyPage from "./pages/PrivacyPage.jsx";
import DealerOverview from "./pages/dealer/DealerOverview.jsx";
import DealerOrders from "./pages/dealer/DealerOrders.jsx";
import DealerInventory from "./pages/dealer/DealerInventory.jsx";
import DealerDeliveries from "./pages/dealer/DealerDeliveries.jsx";
import DealerCustomers from "./pages/dealer/DealerCustomers.jsx";

import FarmerOverview from "./pages/farmer/FarmerOverview.jsx";
import FarmerOrders from "./pages/farmer/FarmerOrders.jsx";
import FarmerTraining from "./pages/farmer/FarmerTraining.jsx";
import FarmerVetSupport from "./pages/farmer/FarmerVetSupport.jsx";
import FarmerSubsidyGuide from "./pages/farmer/FarmerSubsidyGuide.jsx";

import AdminOverview from "./pages/admin/AdminOverview.jsx";
import AdminDealers from "./pages/admin/AdminDealers.jsx";
import AdminFarmers from "./pages/admin/AdminFarmers.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminFarmerSupport from "./pages/admin/AdminFarmerSupport.jsx";

const dealerLinks = [
  { label: "Dashboard", to: "/dealer", icon: DashboardIcon, end: true },
  { label: "Orders", to: "/dealer/orders", icon: OrdersIcon },
  { label: "Inventory", to: "/dealer/inventory", icon: InventoryIcon },
  { label: "Deliveries", to: "/dealer/deliveries", icon: DeliveriesIcon },
  { label: "Customers", to: "/dealer/customers", icon: CustomersIcon },
];

const farmerLinks = [
  { label: "Dashboard", to: "/farmer", icon: DashboardIcon, end: true },
  { label: "Orders", to: "/farmer/orders", icon: OrdersIcon },
  { label: "Training Programs", to: "/farmer/training", icon: TrainingIcon },
  { label: "Vet Support", to: "/farmer/vet-support", icon: VetIcon },
  { label: "Subsidy Guide", to: "/farmer/subsidy-guide", icon: SubsidyIcon },
];

const adminLinks = [
  { label: "Dashboard", to: "/admin", icon: DashboardIcon, end: true },
  { label: "Products", to: "/admin/products", icon: InventoryIcon },
  { label: "Dealers", to: "/admin/dealers", icon: DealersIcon },
  { label: "Farmers", to: "/admin/farmers", icon: AccountsIcon },
  { label: "Orders", to: "/admin/orders", icon: OrdersIcon },
  { label: "Farmer Support", to: "/admin/farmer-support", icon: TrainingIcon },
];

function App() {
  return (
    <AuthProvider>
      <FarmerSupportContentProvider>
      <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="network" element={<NetworkPage />} />
            <Route path="farmer-support" element={<FarmerPage />} />
            <Route path="collaborations" element={<CollaborationPage />} />
            <Route path="social-responsibility" element={<SocialResponsibilityPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
            <Route path="terms" element={<TermsPage />} />
            <Route path="privacy" element={<PrivacyPage />} />

          </Route>

          {/* Dealer dashboard */}
          <Route
            path="dealer"
            element={
              <ProtectedRoute roles={["Dealer"]}>
                <DashboardShell links={dealerLinks} roleLabel="Dealer" accent="navy" />
              </ProtectedRoute>
            }
          >
            <Route index element={<DealerOverview />} />
            <Route path="orders" element={<DealerOrders />} />
            <Route path="inventory" element={<DealerInventory />} />
            <Route path="deliveries" element={<DealerDeliveries />} />
            <Route path="customers" element={<DealerCustomers />} />
          </Route>

          {/* Farmer dashboard */}
          <Route
            path="farmer"
            element={
              <ProtectedRoute roles={["Farmer"]}>
                <DashboardShell links={farmerLinks} roleLabel="Farmer" accent="red" />
              </ProtectedRoute>
            }
          >
            <Route index element={<FarmerOverview />} />
            <Route path="orders" element={<FarmerOrders />} />
            <Route path="training" element={<FarmerTraining />} />
            <Route path="vet-support" element={<FarmerVetSupport />} />
            <Route path="subsidy-guide" element={<FarmerSubsidyGuide />} />
          </Route>

          {/* Admin dashboard */}
          <Route
            path="admin"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <DashboardShell links={adminLinks} roleLabel="Admin" accent="navy" />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminOverview />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="dealers" element={<AdminDealers />} />
            <Route path="farmers" element={<AdminFarmers />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="farmer-support" element={<AdminFarmerSupport />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </FarmerSupportContentProvider>
    </AuthProvider>
  );
}

export default App;
