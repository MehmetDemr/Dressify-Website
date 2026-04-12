import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BrandPage from "./pages/Brand";
import ProfilePage from "./pages/Profile";
import FavoritesPage from "./pages/Favourite";
import SettingsPage from "./pages/Settings";
import CartPage from "./pages/Card";
import ProductDetailsPage from "./pages/ProductDetails";
import ScrollToTop from "./components/ScrollTop/ScrollTop";
import NotFound from "./pages/NotFound";
import UserActivityPage from "./pages/UserActivity";
import ForgotPassword from "./pages/ForgotPassword";
import GoogleCallback from "./pages/GoogleCallback";
import AppleCallback from "./pages/AppleCallback";
import Toastr from "./components/Toastr/toastr.component";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toastr />
      <Routes>
        {/* Landing */}
        <Route path="/" element={<HomePage />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/dashboard/:brandSlug" element={<BrandPage />} />

        <Route path="/dashboard/profile" element={<ProfilePage />} />

        <Route path="/dashboard/favourite" element={<FavoritesPage />} />

        <Route path="/dashboard/settings" element={<SettingsPage />} />

        <Route path="/dashboard/card" element={<CartPage />} />

        <Route
          path="/dashboard/:brandSlug/:categorySlug/:productSlug"
          element={<ProductDetailsPage />}
        />

        <Route path="/dashboard/events" element={<UserActivityPage />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route path="/auth/apple/callback" element={<AppleCallback />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
