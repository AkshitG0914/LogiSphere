import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { X, Bell, Menu, LogOut, Home } from "lucide-react";
import axios from 'axios';
import { 
  BarChart, 
  Package, 
  Users, 
  Settings, 
  ShoppingCart, 
  Truck, 
  Layers, 
  HelpCircle, 
  ChevronDown, 
  MapPin,
  ChartBar
} from "lucide-react";
import { logoutUser } from "../redux/auth/authSlice";

const Navbar = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  // Hover states for animations
  const [hoveredItem, setHoveredItem] = useState(null);

  // Refs for click outside detection
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // API base URL - adjust this based on your environment setup
  const API_BASE_URL = 'http://logisphere-backend-k9dz.onrender.com/api';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotificationDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && showMobileMenu) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMobileMenu]);

  // Fetch notifications from the API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/notifications`);
        
        // Check if the response is valid
        const contentType = response.headers['content-type'];
        if (contentType && contentType.includes('application/json')) {
          const { data } = response;
          
          const processedData = Array.isArray(data) ? data.map(notification => {
            let type = 'general';
            
            // Determine notification type based on content
            if (notification.message.toLowerCase().includes('order')) {
              type = 'order';
            } else if (notification.message.toLowerCase().includes('stock')) {
              type = 'inventory';
            } else if (notification.message.toLowerCase().includes('delivery') || 
                     notification.message.toLowerCase().includes('shipment')) {
              type = 'delivery';
            }
            
            // For backend notifications without actionUrl, generate one based on type
            let actionUrl = notification.actionUrl;
            if (!actionUrl) {
              if (type === 'order') actionUrl = '/orders';
              else if (type === 'inventory') actionUrl = '/inventory';
              else if (type === 'delivery') actionUrl = '/warehouse/shipments';
            }
            
            return { ...notification, type, actionUrl };
          }) : [];
          
          setNotifications(processedData);
          setError(null);
        } else {
          console.warn("API returned non-JSON response:", contentType);
          setError("Invalid response format from server");
          setNotifications([]);
        }
      } catch (err) {
        console.error("Error fetching notifications:", err.message);
        
        // More detailed error reporting
        if (err.response) {
          console.error("Response data:", err.response.data);
          console.error("Response status:", err.response.status);
        } else if (err.request) {
          console.error("No response received:", err.request);
        }
        
        setError(`Failed to load notifications: ${err.message}`);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [API_BASE_URL]);
  
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const userRole = user?.role || "customer"; // Default to customer

  // Handle logout
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
    setShowProfileDropdown(false);
  };

  // Handle logo click
  const handleLogoClick = (e) => {
    if (user) {
      e.preventDefault();
      navigate("/");
    }
  };

  // Check if menu item is active
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  // Role-Based Navigation Items
  const roleBasedNav = {
    admin: [
      { title: "Dashboard", icon: <BarChart size={20} />, path: "/dashboard" },
      { title: "Orders", icon: <Package size={20} />, path: "/orders" },
      { title: "Users", icon: <Users size={20} />, path: "/admin/users" },
      { title: "Inventory", icon: <Layers size={20} />, path: "/inventory" },
    ],
    customer: [
      { title: "Dashboard", icon: <BarChart size={20} />, path: "/dashboard" },
      { title: "Place Order", icon: <ShoppingCart size={20} />, path: "/customer/order" },
    ],
    warehouse_manager: [
      { title: "Dashboard", icon: <BarChart size={20} />, path: "/dashboard" },
      { title: "Inventory", icon: <Layers size={20} />, path: "/inventory" },
      { title: "Orders", icon: <Package size={20} />, path: "/orders" },
    ],
    driver: [
      { title: "Dashboard", icon: <BarChart size={20} />, path: "/dashboard" },
      { title: "My Deliveries", icon: <Truck size={20} />, path: "/driver/deliveries" },
      { title: "Track Shipment", icon: <MapPin size={20} />, path: "/driver/track" },
    ],
  };

  // Get items based on role
  const navItems = roleBasedNav[userRole] || [];

  // Combined profile menu items
  const profileMenuItems = [
    { title: "Dashboard", icon: <BarChart size={20} />, path: "/dashboard" },
    { 
      title: "Logout", 
      icon: <LogOut size={20} />, 
      action: handleLogout,
      className: "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" 
    },
  ];

  // Sample notifications for development (remove in production)
  const sampleNotifications = [
    { 
      type: "order", 
      message: "New order #12345 has been placed", 
      time: "5 min ago", 
      actionUrl: "/orders/12345" 
    },
    { 
      type: "inventory", 
      message: "Low stock alert for item SKU-789", 
      time: "2 hours ago", 
      actionUrl: "/inventory/SKU-789" 
    },
    { 
      type: "delivery", 
      message: "Shipment #54321 has been delivered", 
      time: "Yesterday", 
      actionUrl: "/warehouse/shipments/54321" 
    }
  ];

  // Use sample notifications if in development mode and no notifications fetched
  const displayNotifications = process.env.NODE_ENV === 'development' && notifications.length === 0 && !loading ? 
    sampleNotifications : notifications;

  const notificationCount = displayNotifications.length;

  return (
    <header className="sticky top-0 bg-gradient-to-r from-violet-950 via-indigo-900 to-purple-900 text-white shadow-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16">
          {/* Logo and brand */}
          <Link to={user ? "/" : "/"} className="flex items-center mr-6" onClick={handleLogoClick}>
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg mr-3 transition-transform duration-300 hover:scale-110">
              <Truck size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-zinc-50">
              <span className="bg-gradient-to-r from-violet-200 via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                LogiSphere
              </span>
            </h2>
          </Link>

          {/* Desktop Navigation */}
          <div className="flex items-center flex-grow">
            {user && (
              <nav className="hidden md:flex items-center space-x-1 mr-3">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center transition-all duration-300 ${
                      isActive(item.path)
                        ? "bg-gradient-to-r from-violet-600/80 to-indigo-600/80 text-white shadow-md"
                        : "text-zinc-300 hover:bg-violet-800/30 hover:text-white"
                    }`}
                    onMouseEnter={() => setHoveredItem(`nav-${index}`)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <span 
                      className={`mr-2 ${isActive(item.path) ? "text-white" : "text-violet-300"} transition-transform duration-300 ${
                        hoveredItem === `nav-${index}` ? "scale-110" : ""
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.title}</span>
                  </Link>
                ))}
              </nav>
            )}

            {/* Right side items */}
            <div className="flex items-center ml-auto">
              {/* Notifications */}
              {user && (
                <div className="relative" ref={notificationRef}>
                  <button
                    className="p-2 rounded-full hover:bg-violet-800/40 transition-all duration-300 relative"
                    onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                    onMouseEnter={() => setHoveredItem('notifications')}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <Bell 
                      size={20} 
                      className={`text-violet-300 transition-transform duration-300 ${
                        hoveredItem === 'notifications' ? "scale-110" : ""
                      }`} 
                    />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow-md">
                        {notificationCount}
                      </span>
                    )}
                  </button>

                  {/* Notification dropdown */}
                  {showNotificationDropdown && (
                    <div className="absolute right-0 mt-2 w-80 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl rounded-xl shadow-xl z-50 text-gray-800 dark:text-gray-200 overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
                      <div className="bg-gradient-to-r from-violet-800 to-indigo-900 px-4 py-3 text-white flex justify-between items-center">
                        <h3 className="font-medium">Notifications</h3>
                        <button
                          className="text-white/80 hover:text-white transition-colors"
                          onClick={() => setShowNotificationDropdown(false)}
                        >
                          <X size={18} />
                        </button>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                          <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-400"></div>
                          </div>
                        ) : error ? (
                          <div className="bg-red-900/30 border border-red-800/40 rounded-lg p-4 text-red-300 text-sm m-3">
                            {error}
                          </div>
                        ) : displayNotifications.length > 0 ? (
                          displayNotifications.map((notif, index) => (
                            <Link
                              key={index}
                              to={notif.actionUrl || "#"}
                              className="block px-4 py-3 hover:bg-violet-50/50 dark:hover:bg-violet-900/20 border-b border-slate-200/30 dark:border-slate-700/30 last:border-0 transition-colors"
                              onClick={() => setShowNotificationDropdown(false)}
                            >
                              <div className="flex items-start">
                                <div
                                  className={`
                                  rounded-full p-2 mr-3 mt-1 shadow-sm
                                  ${
                                    notif.type === "order"
                                      ? "bg-indigo-100 text-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-300"
                                      : notif.type === "inventory"
                                      ? "bg-amber-100 text-amber-500 dark:bg-amber-900/30 dark:text-amber-300"
                                      : notif.type === "delivery"
                                      ? "bg-violet-100 text-violet-500 dark:bg-violet-900/30 dark:text-violet-300"
                                      : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-300"
                                  }
                                `}
                                >
                                  {notif.type === "order" ? (
                                    <Package size={16} />
                                  ) : notif.type === "inventory" ? (
                                    <Layers size={16} />
                                  ) : notif.type === "delivery" ? (
                                    <Truck size={16} />
                                  ) : (
                                    <Bell size={16} />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-gray-800 dark:text-gray-200">
                                    {notif.message}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {notif.time}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          ))
                        ) : (
                          <div className="py-12 px-4 text-center text-gray-500 dark:text-gray-400">
                            <Bell
                              size={24}
                              className="mx-auto mb-3 text-gray-400 dark:text-gray-500"
                            />
                            <p>No notifications yet</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Profile section */}
              {user ? (
                <div className="relative" ref={profileRef}>
                  <div
                    className="flex items-center space-x-2 cursor-pointer ml-3 p-1.5 rounded-lg hover:bg-violet-800/30 transition-colors"
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    onMouseEnter={() => setHoveredItem('profile')}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-medium shadow-md transition-transform duration-300">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="hidden md:block">
                      <p className="text-sm font-medium text-white">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-violet-300 truncate">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>
                    <ChevronDown 
                      size={16} 
                      className={`text-violet-300 hidden md:block transition-transform duration-300 ${
                        hoveredItem === 'profile' || showProfileDropdown ? "rotate-180" : ""
                      }`} 
                    />
                  </div>

                  {/* Profile dropdown */}
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl rounded-xl shadow-xl z-50 text-gray-800 dark:text-gray-200 overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
                      <div className="px-4 py-3 border-b border-slate-200/30 dark:border-slate-700/30 bg-gradient-to-r from-violet-50/30 to-indigo-50/30 dark:from-violet-900/20 dark:to-indigo-900/20">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{user?.name || "User"}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email || "user@example.com"}</p>
                      </div>
                      {profileMenuItems.map((item, index) => (
                        item.path ? (
                          <Link
                            key={index}
                            to={item.path}
                            className={`flex items-center px-4 py-2.5 text-sm hover:bg-violet-50/70 dark:hover:bg-violet-900/30 transition-colors ${item.className || ''}`}
                            onClick={() => setShowProfileDropdown(false)}
                          >
                            <span className="mr-3 text-gray-600 dark:text-gray-400">{item.icon}</span>
                            <span>{item.title}</span>
                          </Link>
                        ) : (
                          <button
                            key={index}
                            className={`flex items-center w-full px-4 py-2.5 text-sm hover:bg-violet-50/70 dark:hover:bg-violet-900/30 transition-colors text-left ${item.className || ''}`}
                            onClick={item.action}
                          >
                            <span className="mr-3 text-gray-600 dark:text-gray-400">{item.icon}</span>
                            <span>{item.title}</span>
                          </button>
                        )
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-medium transition-colors shadow-md hover:shadow-lg"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 rounded-lg bg-transparent border border-violet-500 hover:bg-violet-700/20 text-violet-300 text-sm font-medium transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              {user && (
                <button
                  className="md:hidden p-2 ml-2 rounded-lg hover:bg-violet-800/40 transition-colors"
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                >
                  <Menu size={20} className="text-violet-300" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-violet-900/50 shadow-lg animate-in slide-in-from-top duration-300" ref={mobileMenuRef}>
          <div className="bg-gradient-to-br from-violet-950/95 to-indigo-900/95 backdrop-blur-md p-3 space-y-1 rounded-b-xl">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  isActive(item.path)
                    ? "bg-gradient-to-r from-violet-600/80 to-indigo-600/80 text-white shadow-md"
                    : "text-zinc-300 hover:bg-violet-800/40 hover:text-white"
                }`}
                onClick={() => setShowMobileMenu(false)}
              >
                <span className={`mr-3 ${isActive(item.path) ? "text-white" : "text-violet-300"}`}>
                  {item.icon}
                </span>
                <span>{item.title}</span>
              </Link>
            ))}

            {/* Additional nav items for mobile */}
            <div className="border-t border-violet-800/30 mt-3 pt-3">
              {profileMenuItems.filter(item => item.title !== "Dashboard").map((item, index) => (
                item.path ? (
                  <Link
                    key={index}
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg text-base font-medium text-zinc-300 hover:bg-violet-800/40 hover:text-white transition-colors ${item.className ? 'text-red-300 hover:text-red-200' : ''}`}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <span className="mr-3 text-violet-300">{item.icon}</span>
                    <span>{item.title}</span>
                  </Link>
                ) : (
                  <button
                    key={index}
                    className={`flex items-center w-full px-4 py-3 rounded-lg text-base font-medium text-zinc-300 hover:bg-violet-800/40 hover:text-white transition-colors text-left ${item.className ? 'text-red-300 hover:text-red-200' : ''}`}
                    onClick={item.action}
                  >
                    <span className="mr-3 text-violet-300">{item.icon}</span>
                    <span>{item.title}</span>
                  </button>
                )
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;