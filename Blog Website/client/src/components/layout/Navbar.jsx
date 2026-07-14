import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ChevronRight, 
    Menu, 
    PenSquare, 
    X, 
    LogOut, 
    Settings, 
    User, 
    ShieldAlert, 
    ChevronDown 
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import userAuthStore from "../../store/authStore";
import api from "../../api/axios";
import { CURRENT_USER_ROUTE } from "../../constants/route";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [adminMenuOpen, setAdminMenuOpen] = useState(false);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
    
    const user = userAuthStore((state) => state.user);
    const setUser = userAuthStore((state) => state.setUser);

    // Safeguard to check if current logged-in user is an admin
    const isAdmin = user?.role === "admin" || user?.isAdmin === true;

    const ROUTES_CONFIG = [
        { title: "Home", path: "/" },
        { title: "Explore", path: "/explore" },
        { title: "Categories", path: "/explore/category" },
        { title: "Profile", path: `/profile/${user?._id}` },
    ];

    const ADMIN_ROUTES_CONFIG = [
        { title: "Dashboard", path: "/admin/dashboard" },
        { title: "All Blogs", path: "/admin/blogs" },
        { title: "Users", path: "/admin/users" },
        { title: "Trending", path: "/admin/blogs/trending" },
        { title: "Latest", path: "/admin/blogs/latest" },
    ];

    useEffect(() => {
        const currentUser = async () => {
            try {
                const { data } = await api.get(CURRENT_USER_ROUTE);
                setUser(data.user);
            } catch (error) {
                console.log(error);
            }
        };
        currentUser();
    }, [setUser]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleOutsideClick = () => {
            setProfileMenuOpen(false);
            setAdminMenuOpen(false);
        };
        window.addEventListener("click", handleOutsideClick);
        return () => window.removeEventListener("click", handleOutsideClick);
    }, []);

    const getProfileMenuActions = () => [
        { title: "Profile", path: `/profile/${user?._id}`, icon: <User size={18} />, type: "link" },
        { title: "Settings", path: "/profile/update", icon: <Settings size={18} />, type: "link" },
        { title: "Sign Out", path: "/sign-out", icon: <LogOut size={18} />, type: "signout", className: "text-red-600 hover:bg-red-50" }
    ];

    const handleProfileClick = (e) => {
        e.stopPropagation();
        if (window.innerWidth < 1024) {
            setIsMobileProfileOpen(true);
        } else {
            setProfileMenuOpen(!profileMenuOpen);
            setAdminMenuOpen(false);
        }
    };

    const handleAdminClick = (e) => {
        e.stopPropagation();
        setAdminMenuOpen(!adminMenuOpen);
        setProfileMenuOpen(false);
    };

    return (
        <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-2 sm:top-4 left-0 right-0 z-50 select-none px-4 sm:px-6 lg:px-8"
        >
            <div className="mx-auto max-w-[1500px]">
                <div className="flex items-center justify-between rounded-2xl sm:rounded-3xl border border-[#C8D8E8] px-4 sm:px-7 py-3 sm:py-4 shadow-[0_12px_40px_rgba(0,0,0,0.08)] bg-white">

                    {/* Logo */}
                    <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => navigate("/")}>
                        <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl sm:rounded-2xl bg-[#0077CC] text-white">
                            <PenSquare size={16} />
                        </div>
                        <span className="text-lg sm:text-xl font-bold tracking-tight text-stone-900 whitespace-nowrap">
                            The Daily Binge
                        </span>
                    </div>

                    {/* Desktop Routes */}
                    <div className="hidden lg:flex items-center gap-1 xl:gap-2">
                        {ROUTES_CONFIG.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <motion.div
                                    key={link.title}
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => navigate(link.path)}
                                    className={`relative cursor-pointer rounded-2xl px-4 py-2 text-sm font-medium transition-colors z-10 ${
                                        isActive ? "text-stone-900" : "text-stone-500 hover:text-stone-900"
                                    }`}
                                >
                                    {link.title}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTabIndicator"
                                            className="absolute inset-0 -z-10 rounded-2xl bg-stone-100"
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                </motion.div>
                            );
                        })}

                        {/* Desktop Admin Portal Dropdown */}
                        {isAdmin && (
                            <div className="relative ml-2 border-l border-stone-200 pl-2">
                                <button
                                    onClick={handleAdminClick}
                                    className={`flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-sm font-semibold transition-colors ${
                                        adminMenuOpen || location.pathname.startsWith("/admin") 
                                            ? "bg-[#0077CC]/10 text-[#0077CC]" 
                                            : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                                    }`}
                                >
                                    <ShieldAlert size={15} />
                                    Admin
                                    <ChevronDown size={14} className={`transition-transform duration-200 ${adminMenuOpen ? "rotate-180" : ""}`} />
                                </button>

                                <AnimatePresence>
                                    {adminMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute left-0 mt-3 w-48 bg-white border border-stone-200 rounded-2xl shadow-xl overflow-hidden z-50 py-1.5"
                                        >
                                            <div className="px-3 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-widest border-b border-stone-50 mb-1">
                                                Control Panel
                                            </div>
                                            {ADMIN_ROUTES_CONFIG.map((route) => (
                                                <button
                                                    key={route.path}
                                                    onClick={() => {
                                                        setAdminMenuOpen(false);
                                                        navigate(route.path);
                                                    }}
                                                    className="flex items-center w-full px-4 py-2 text-left text-sm text-stone-700 hover:bg-[#EBF1F8] hover:text-[#0077CC] transition-colors"
                                                >
                                                    {route.title}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* Right Hand Side (Profile / Mobile Trigger) */}
                    <div className="flex items-center gap-1 sm:gap-2">
                        <div className="relative">
                            {user ? (
                                <button
                                    onClick={handleProfileClick}
                                    className="rounded-full w-9 h-9 sm:w-10 sm:h-10 bg-[#0D1B2A] flex items-center justify-center text-white overflow-hidden transition-colors hover:bg-[#0077CC] outline-none"
                                >
                                    {user.profileImg ? (
                                        <img className="w-full h-full object-cover" src={user.profileImg} alt="Profile" />
                                    ) : (
                                        <span className="text-xs sm:text-sm font-bold">{user.name?.charAt(0).toUpperCase() || "?"}</span>
                                    )}
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate("/sign-in")}
                                    className="rounded-2xl bg-[#0D1B2A] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0077CC]"
                                >
                                    Sign In
                                </button>
                            )}

                            {/* User Profile Dropdown (Desktop) */}
                            <AnimatePresence>
                                {profileMenuOpen && user && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="hidden lg:block absolute right-0 mt-3 w-48 bg-white border border-stone-200 rounded-2xl shadow-xl overflow-hidden z-50 py-1"
                                    >
                                        {getProfileMenuActions().map((action) => (
                                            <div key={action.title}>
                                                {action.type === "signout" && <hr className="border-stone-100 my-1" />}
                                                <button
                                                    onClick={() => {
                                                        setProfileMenuOpen(false);
                                                        navigate(action.path);
                                                    }}
                                                    className={`flex items-center gap-2 w-full px-4 py-2.5 text-left text-sm transition-colors ${
                                                        action.className || "text-stone-700 hover:bg-stone-100"
                                                    }`}
                                                >
                                                    {action.icon}
                                                    {action.title}
                                                </button>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Hamburger Button */}
                        <button
                            className="rounded-xl sm:rounded-2xl p-2 text-stone-500 transition-colors hover:bg-[#EBF1F8] hover:text-stone-900 lg:hidden"
                            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                        >
                            {isMobileNavOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {isMobileNavOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="mx-2 mt-2 max-h-[80vh] overflow-y-auto rounded-2xl border border-stone-200 bg-white p-3 shadow-xl lg:hidden flex flex-col gap-1"
                    >
                        {/* Standard Pages */}
                        <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider px-4 py-1.5">
                            Menu
                        </div>
                        {ROUTES_CONFIG.map((link) => (
                            <button
                                key={link.title}
                                onClick={() => {
                                    setIsMobileNavOpen(false);
                                    navigate(link.path);
                                }}
                                className="flex items-center justify-between rounded-xl px-4 py-3 text-stone-700 transition-colors hover:bg-stone-50 text-left font-medium text-sm"
                            >
                                {link.title}
                                <ChevronRight size={16} className="text-stone-400" />
                            </button>
                        ))}

                        {/* Conditional Admin Section for Mobile */}
                        {isAdmin && (
                            <div className="mt-2 pt-2 border-t border-stone-100">
                                <div className="text-xs font-semibold text-[#0077CC] uppercase tracking-wider px-4 py-1.5 flex items-center gap-1.5">
                                    <ShieldAlert size={14} />
                                    Admin Settings
                                </div>
                                {ADMIN_ROUTES_CONFIG.map((link) => (
                                    <button
                                        key={link.title}
                                        onClick={() => {
                                            setIsMobileNavOpen(false);
                                            navigate(link.path);
                                        }}
                                        className="flex items-center justify-between rounded-xl px-4 py-3 text-stone-600 transition-colors hover:bg-[#0077CC]/5 hover:text-[#0077CC] text-left font-medium text-sm"
                                    >
                                        {link.title}
                                        <ChevronRight size={16} className="text-[#0077CC]/60" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Bottom Sheet (Profile Menu) */}
            <AnimatePresence>
                {isMobileProfileOpen && user && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black z-40 lg:hidden"
                            onClick={() => setIsMobileProfileOpen(false)}
                        />

                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                            className="fixed left-0 right-0 bottom-0 max-h-[85vh] bg-white rounded-t-[2.5rem] shadow-2xl z-50 lg:hidden px-6 pb-8 pt-4 overflow-y-auto flex flex-col gap-2"
                        >
                            <div className="w-12 h-1.5 bg-stone-200 rounded-full mx-auto mb-4" />
                            <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider px-2 mb-1">
                                Account Actions
                            </div>
                            {getProfileMenuActions().map((action) => (
                                <button
                                    key={action.title}
                                    onClick={() => {
                                        setIsMobileProfileOpen(false);
                                        navigate(action.path);
                                    }}
                                    className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left font-medium text-base transition-colors ${
                                        action.type === "signout" ? "bg-red-50 text-red-600 mt-2" : "text-stone-700 hover:bg-stone-50"
                                    }`}
                                >
                                    {action.icon}
                                    {action.title}
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}

export default Navbar;