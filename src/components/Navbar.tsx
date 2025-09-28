"use client";
import React, {
  useState,
  useContext,
  useRef,
  useEffect,
  useCallback,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaBuilding,
  FaHome,
  FaPhone,
  FaInfoCircle,
  FaSignOutAlt,
  FaHotel,
  FaUserTie,
  FaChevronDown,
} from "react-icons/fa";
import { AuthContext } from "@/context/AuthContext";
import StayWheelsLogo from "./StayWheelsLogo";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loginDropdown, setLoginDropdown] = useState(false);
  const [registerDropdown, setRegisterDropdown] = useState(false);
  const loginRef = useRef<HTMLDivElement>(null);
  const registerRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const auth = useContext(AuthContext);

  // Scroll to top function
  const scrollToTop = useCallback(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (loginRef.current && !loginRef.current.contains(event.target as Node))
        setLoginDropdown(false);
      if (
        registerRef.current &&
        !registerRef.current.contains(event.target as Node)
      )
        setRegisterDropdown(false);
      if (
        isOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      )
        setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!auth) return null;
  const { user, role, logout } = auth;
  const isLoggedIn = !!user;

  const getCurrentUserInfo = () => {
    if (isLoggedIn && user) {
      if (role === "owner") {
        return {
          role: "owner",
          name: user.businessName || user.ownerName,
          dashboard: "/owner/dashboard",
          icon: FaUserTie,
        };
      }
      return {
        role: "user",
        name: user.name || user.email,
        dashboard: "/user/dashboard",
        icon: FaUser,
      };
    }
    return null;
  };
  const currentUser = getCurrentUserInfo();

  // Hide Navbar if logged in as admin, owner, or user
  // if (isLoggedIn && currentUser && ['admin', 'owner', 'user'].includes(currentUser.role)) {
  //   return null;
  // }

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push("/");
  };

  const handleNavClick = (href: string) => {
    scrollToTop();
    setIsOpen(false);
    router.push(href);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div
              onClick={() =>
                handleNavClick(
                  isLoggedIn && currentUser
                    ? currentUser.role === "owner"
                      ? "/owner/dashboard"
                      : "/"
                    : "/"
                )
              }
              className="flex items-center h-16 cursor-pointer"
            >
              <div className="flex items-center h-12">
                <StayWheelsLogo />
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {(!isLoggedIn || (currentUser && currentUser.role === "user")) && (
              <>
                <Link
                  href="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center focus:outline-none active:scale-95 transition-transform duration-100 ${
                    pathname === "/"
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {" "}
                  <FaHome className="mr-1" /> Home{" "}
                </Link>
                <Link
                  href="/pg"
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center focus:outline-none active:scale-95 transition-transform duration-100 ${
                    pathname.startsWith("/pg")
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {" "}
                  <FaBuilding className="mr-1" /> PG{" "}
                </Link>
                <Link
                  href="/rooms"
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center focus:outline-none active:scale-95 transition-transform duration-100 ${
                    pathname.startsWith("/rooms")
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {" "}
                  <FaHotel className="mr-1" /> Rooms & Flats{" "}
                </Link>
              </>
            )}
            {!isLoggedIn && (
              <>
                <Link
                  href="/about"
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center focus:outline-none active:scale-95 transition-transform duration-100 ${
                    pathname.startsWith("/about")
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {" "}
                  <FaInfoCircle className="mr-1" /> About{" "}
                </Link>
                <Link
                  href="/contact"
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center focus:outline-none active:scale-95 transition-transform duration-100 ${
                    pathname.startsWith("/contact")
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {" "}
                  <FaPhone className="mr-1" /> Contact{" "}
                </Link>
              </>
            )}
            {isLoggedIn && currentUser ? (
              <div className="flex items-center space-x-4">
                <Link
                  href={currentUser.dashboard || "/dashboard"}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  {currentUser.icon &&
                    React.createElement(currentUser.icon, {
                      className: "mr-1",
                    })}
                  {currentUser.role === "owner"
                    ? "Owner Dashboard"
                    : "Dashboard"}
                </Link>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {currentUser.role === "owner"
                      ? "Owner"
                      : "User"}
                    : {currentUser.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-800 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <FaSignOutAlt className="mr-1" /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="relative" ref={loginRef}>
                  <button
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center focus:outline-none active:scale-95 transition-transform duration-100"
                    onClick={() => {
                      setLoginDropdown((prev) => !prev);
                      setRegisterDropdown(false);
                    }}
                  >
                    <FaUser className="mr-1" /> Login{" "}
                    <FaChevronDown
                      className={`ml-1 transition-transform duration-200 ${
                        loginDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`absolute right-0 mt-2 w-48 bg-white rounded-xl border border-gray-200 z-50 transition-all duration-200 transform min-w-48 ${
                      loginDropdown
                        ? "opacity-100 visible translate-y-0 scale-100"
                        : "opacity-0 invisible -translate-y-2 scale-95"
                    }`}
                    onMouseLeave={() => setLoginDropdown(false)}
                  >
                    <Link
                      href="/auth/login?role=user"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors duration-150"
                      onClick={() => {
                        scrollToTop();
                        setLoginDropdown(false);
                      }}
                    >
                      User Login
                    </Link>
                    <Link
                      href="/auth/login?role=owner"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors duration-150"
                      onClick={() => {
                        scrollToTop();
                        setLoginDropdown(false);
                      }}
                    >
                      Owner Login
                    </Link>
                  </div>
                </div>
                <div className="relative" ref={registerRef}>
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none active:scale-95 transition-transform duration-100 flex items-center"
                    onClick={() => {
                      setRegisterDropdown((prev) => !prev);
                      setLoginDropdown(false);
                    }}
                  >
                    Register{" "}
                    <FaChevronDown
                      className={`ml-1 transition-transform duration-200 ${
                        registerDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`absolute right-0 mt-2 w-48 bg-white rounded-xl border border-gray-200 z-50 transition-all duration-200 transform min-w-48 ${
                      registerDropdown
                        ? "opacity-100 visible translate-y-0 scale-100"
                        : "opacity-0 invisible -translate-y-2 scale-95"
                    }`}
                    onMouseLeave={() => setRegisterDropdown(false)}
                  >
                    <Link
                      href="/auth/register?role=user"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors duration-150"
                      onClick={() => {
                        scrollToTop();
                        setRegisterDropdown(false);
                      }}
                    >
                      User Register
                    </Link>
                    <Link
                      href="/auth/register?role=owner"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors duration-150"
                      onClick={() => {
                        scrollToTop();
                        setRegisterDropdown(false);
                      }}
                    >
                      Owner Register
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              {isOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden" ref={mobileMenuRef}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
              {(!isLoggedIn ||
                (currentUser && currentUser.role === "user")) && (
                <>
                  <Link
                    href="/"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      pathname === "/"
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : "text-gray-700 hover:text-blue-600"
                    }`}
                    onClick={() => handleNavClick("/")}
                  >
                    <FaHome className="inline mr-2" /> Home
                  </Link>
                  <Link
                    href="/pg"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      pathname.startsWith("/pg")
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : "text-gray-700 hover:text-blue-600"
                    }`}
                    onClick={() => handleNavClick("/pg")}
                  >
                    <FaBuilding className="inline mr-2" /> PG
                  </Link>
                  <Link
                    href="/rooms"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      pathname.startsWith("/rooms")
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : "text-gray-700 hover:text-blue-600"
                    }`}
                    onClick={() => handleNavClick("/rooms")}
                  >
                    <FaHotel className="inline mr-2" /> Rooms & Flats
                  </Link>
                </>
              )}
              {!isLoggedIn && (
                <>
                  <Link
                    href="/about"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      pathname.startsWith("/about")
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : "text-gray-700 hover:text-blue-600"
                    }`}
                    onClick={() => handleNavClick("/about")}
                  >
                    <FaInfoCircle className="inline mr-2" /> About
                  </Link>
                  <Link
                    href="/contact"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      pathname.startsWith("/contact")
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : "text-gray-700 hover:text-blue-600"
                    }`}
                    onClick={() => handleNavClick("/contact")}
                  >
                    <FaPhone className="inline mr-2" /> Contact
                  </Link>
                </>
              )}
              <div className="border-t border-gray-200 pt-4">
                {isLoggedIn ? (
                  <>
                    <div className="px-3 py-2">
                      <span className="text-sm text-gray-600">
                        {currentUser?.role === "owner"
                          ? "Owner"
                          : "User"}
                        : {currentUser?.name}
                      </span>
                    </div>
                    <Link
                      href={currentUser?.dashboard || "/dashboard"}
                      className="text-blue-600 hover:text-blue-800 block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() =>
                        handleNavClick(currentUser?.dashboard || "/dashboard")
                      }
                    >
                      {currentUser?.icon &&
                        React.createElement(currentUser.icon, {
                          className: "inline mr-2",
                        })}
                      {currentUser?.role === "owner"
                        ? "Owner Dashboard"
                        : "Dashboard"}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-red-600 hover:text-red-800 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                    >
                      <FaSignOutAlt className="inline mr-2" /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <button
                        className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-900 focus:outline-none"
                        onClick={() => setLoginDropdown((prev) => !prev)}
                        aria-controls="mobile-login-options"
                        type="button"
                      >
                        <span>Login as:</span>
                        <FaChevronDown
                          className={`ml-2 transition-transform ${
                            loginDropdown ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {loginDropdown && (
                        <div id="mobile-login-options" className="pl-2">
                          <Link
                            href="/auth/login?role=user"
                            className="text-gray-700 hover:text-blue-600 block px-6 py-2 rounded-md text-sm"
                            onClick={() => {
                              scrollToTop();
                              setIsOpen(false);
                            }}
                          >
                            User
                          </Link>
                          <Link
                            href="/auth/login?role=owner"
                            className="text-gray-700 hover:text-blue-600 block px-6 py-2 rounded-md text-sm"
                            onClick={() => {
                              scrollToTop();
                              setIsOpen(false);
                            }}
                          >
                            Owner
                          </Link>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1 mt-4">
                      <button
                        className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-900 focus:outline-none"
                        onClick={() => setRegisterDropdown((prev) => !prev)}
                        aria-controls="mobile-register-options"
                        type="button"
                      >
                        <span>Register as:</span>
                        <FaChevronDown
                          className={`ml-2 transition-transform ${
                            registerDropdown ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {registerDropdown && (
                        <div id="mobile-register-options" className="pl-2">
                          <Link
                            href="/auth/register?role=user"
                            className="text-gray-700 hover:text-blue-600 block px-6 py-2 rounded-md text-sm"
                            onClick={() => {
                              scrollToTop();
                              setIsOpen(false);
                            }}
                          >
                            User
                          </Link>
                          <Link
                            href="/auth/register?role=owner"
                            className="text-gray-700 hover:text-blue-600 block px-6 py-2 rounded-md text-sm"
                            onClick={() => {
                              scrollToTop();
                              setIsOpen(false);
                            }}
                          >
                            Owner
                          </Link>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
