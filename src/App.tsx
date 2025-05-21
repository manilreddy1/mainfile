import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Academics from "./pages/Academics";
import Contact from "./pages/Contact";
import HowItWorks from "./pages/HowItWorks";
import Search from "./pages/Search";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import ChangePassword from "./pages/ChangePassword";
import AuthCallback from "./pages/AuthCallback";
import PlaceholderPage from "./pages/Placeholder";
import NotFound from "./pages/NotFound";
import VerificationDashboard from "./pages/VerificationDashboard";
import TeacherDemoUploadPage from "./pages/TeacherDemoUploadPage";
import ChatRoom from "./pages/ChatRoom";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import TermsPage from "./pages/policies/TermsPage";
import PrivacyPage from "./pages/policies/PrivacyPage";
import CookiePage from "./pages/policies/CookiePage";
import RefundPage from "./pages/policies/RefundPage";
import AboutPage from "./pages/policies/AboutPage";
import CareersPage from "./pages/policies/CareersPage";
import ContactPage from "./pages/policies/ContactPage";
import Navbar from "./components/layout/Navbar";
import Blog from "./pages/Blog";
import Pricing from "./pages/Pricing";

// Auth-protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

// Public route wrapper (redirects to dashboard if authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// App routes with auth protection
const AppRoutes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect authenticated users away from public pages
  useEffect(() => {
    if (user) {
      const publicRoutes = ['/', '/academics', '/how-it-works', '/contact'];
      if (publicRoutes.includes(location.pathname)) {
        navigate('/dashboard');
      }
    }
  }, [user, location.pathname, navigate]);
  
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      {/* Public marketing pages (will redirect to dashboard if logged in) */}
      <Route path="/" element={<PublicRoute><Index /></PublicRoute>} />
      <Route path="/academics" element={<PublicRoute><Academics /></PublicRoute>} />
      <Route path="/how-it-works" element={<PublicRoute><HowItWorks /></PublicRoute>} />
      <Route path="/contact" element={<PublicRoute><Contact /></PublicRoute>} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/profile/edit" element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} />
      <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
      <Route path="/verification" element={<ProtectedRoute><VerificationDashboard /></ProtectedRoute>} />
      <Route path="/upload-demo" element={<ProtectedRoute><TeacherDemoUploadPage /></ProtectedRoute>} />
      <Route path="/chat/:tutorId" element={<ProtectedRoute><ChatRoom /></ProtectedRoute>} />
      
      {/* Placeholder pages */}
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/careers" element={<CareersPage />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/cookie-policy" element={<CookiePage />} />
      <Route path="/refund" element={<RefundPage />} />
      <Route path="/ContactPage" element={<ContactPage />} />
      <Route path="/Contact" element={<Contact />} />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <AppRoutes />
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
