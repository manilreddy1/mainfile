import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ProfileDropdown from "@/components/profile/ProfileDropdown";
import RoleSpecificNavigation from "@/components/auth/RoleSpecificNavigation";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  // Debug log to check authentication state
  console.log("Navbar auth state - user:", !!user, "profile:", !!profile);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      console.error("Error during logout:", error);
      toast({
        title: "Logout failed",
        description: "There was an error during logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="bg-white shadow-sm py-4 sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-blue-600 font-bold text-2xl">CoLearnerr</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {!user ? (
            <>
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
                Home
              </Link>
              <Link to="/academics" className="text-gray-700 hover:text-blue-600 font-medium">
                Academics
              </Link>
              <Link to="/how-it-works" className="text-gray-700 hover:text-blue-600 font-medium">
                How It Works
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600 font-medium">
                Contact Us
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
                Dashboard
              </Link>
              <Link to="/search" className="text-gray-700 hover:text-blue-600 font-medium">
                Search
              </Link>
            </>
          )}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <RoleSpecificNavigation />
              {profile && <ProfileDropdown profile={profile} />}
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="font-medium">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
        
        {/* Mobile menu button */}
        <button className="md:hidden text-gray-700" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 shadow-lg animate-fade-in">
          <div className="container mx-auto px-4 flex flex-col gap-4">
            {!user ? (
              <>
                <Link
                  to="/"
                  className="text-gray-700 hover:text-blue-600 font-medium py-2"
                  onClick={toggleMenu}
                >
                  Home
                </Link>
                <Link
                  to="/academics"
                  className="text-gray-700 hover:text-blue-600 font-medium py-2"
                  onClick={toggleMenu}
                >
                  Academics
                </Link>
                <Link
                  to="/how-it-works"
                  className="text-gray-700 hover:text-blue-600 font-medium py-2"
                  onClick={toggleMenu}
                >
                  How It Works
                </Link>
                <Link
                  to="/contact"
                  className="text-gray-700 hover:text-blue-600 font-medium py-2"
                  onClick={toggleMenu}
                >
                  Contact Us
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-blue-600 font-medium py-2"
                  onClick={toggleMenu}
                >
                  Dashboard
                </Link>
                <Link
                  to="/search"
                  className="text-gray-700 hover:text-blue-600 font-medium py-2"
                  onClick={toggleMenu}
                >
                  Search
                </Link>
              </>
            )}

            <div className="flex flex-col gap-3 mt-3">
              {user ? (
                <>
                  <Link to="/profile" onClick={toggleMenu}>
                    <Button variant="outline" className="w-full font-medium">
                      Profile
                    </Button>
                  </Link>
                  <Button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={toggleMenu}>
                    <Button variant="outline" className="w-full font-medium">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={toggleMenu}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
            {user &&
              profile &&
              (profile.role === "verification_member" || profile.role === "admin") && (
                <Link to="/verification" onClick={toggleMenu}>
                  <Button
                    variant="outline"
                    className="w-full font-medium flex items-center justify-center"
                  >
                    <CheckCircle2 size={16} className="mr-2" />
                    Verification Panel
                  </Button>
                </Link>
              )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
