import { useEffect, useState, cloneElement } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchCustomerOrders, updateCustomerProfile } from "../redux/customer/customerSlice";
import { Package, Truck, MapPin, Edit3, Save, User, ShieldCheck, ChevronRight, DollarSign, ChartBar, Settings, ArrowRightIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Navbar from "../components/Navbar";

const CustomerDashboard = () => {
  const dispatch = useDispatch();
  const { orders, profile, loading, error } = useSelector((state) => state.customer);
  const [trackingId, setTrackingId] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [scrollY, setScrollY] = useState(0);
  const [animateStats, setAnimateStats] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    dispatch(fetchCustomerOrders());
    dispatch(updateCustomerProfile()); // Fetch profile if needed
    setTimeout(() => setAnimateStats(true), 100);
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setUserData({ name: profile.name, email: profile.email });
    }
  }, [profile]);

  const handleProfileUpdate = () => {
    dispatch(updateCustomerProfile(userData));
    setEditMode(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
      <Navbar />
      <main className="flex-1 overflow-y-auto relative">
        {/* Background with depth layers */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Updated background gradient to match violet/indigo theme */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-violet-950 via-indigo-900 to-purple-900 h-64"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          ></div>
          
          {/* Updated geometric shapes with new color scheme */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-violet-400 blur-3xl"
                 style={{ transform: `translateY(${scrollY * 0.15}px)` }}></div>
            <div className="absolute top-1/2 -left-32 w-64 h-64 rounded-full bg-indigo-500 blur-3xl"
                 style={{ transform: `translateY(${-scrollY * 0.2}px)` }}></div>
            <div className="absolute bottom-20 right-1/3 w-80 h-80 rounded-full bg-purple-400 blur-3xl"
                 style={{ transform: `translateY(${-scrollY * 0.25}px)` }}></div>
          </div>
          
          {/* Adding background grid pattern */}
          <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800/20 [mask-image:linear-gradient(to_bottom,transparent,50%,white)]"></div>
        </div>
        
        <div className="relative z-10 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header with updated design */}
            <header className="mb-8 pt-6 text-white">
              <div className="mb-4 inline-flex items-center px-4 py-2 rounded-full bg-violet-500/20 text-violet-200 text-sm font-medium tracking-wider">
                <User size={16} className="mr-2" />
                CUSTOMER DASHBOARD
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-2">
                <span className="text-zinc-50 block">Welcome back,</span>
                <span className="bg-gradient-to-r from-violet-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent">
                  {profile?.name || "User"}
                </span>
              </h1>
              <p className="text-zinc-300 mt-2">Here's what's happening with your supply chain today</p>
            </header>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-16 h-16 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <p className="bg-red-500/10 border border-red-500/20 text-red-500 font-semibold text-center p-4 rounded-xl">
                Error: {error}
              </p>
            ) : (
              <>
                {/* Stat cards updated with glassy design */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-16">
                  <StatCard 
                    title="Total Orders" 
                    value={orders.length} 
                    change="+12.5%" 
                    isPositive={true} 
                    icon={<Package size={24} className="text-white" />} 
                    delay={0} 
                    animate={animateStats}
                    color="violet" 
                  />
                  <StatCard 
                    title="Active Shipments" 
                    value={orders.filter(order => order.orderStatus !== "Delivered").length} 
                    change="+8.2%" 
                    isPositive={true} 
                    icon={<Truck size={24} className="text-white" />} 
                    delay={100} 
                    animate={animateStats}
                    color="indigo" 
                  />
                  <StatCard 
                    title="Completed" 
                    value={orders.filter(order => order.orderStatus === "Delivered").length} 
                    change="+5.3%" 
                    isPositive={true} 
                    icon={<ShieldCheck size={24} className="text-white" />} 
                    delay={200} 
                    animate={animateStats}
                    color="purple" 
                  />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  {/* Orders Table Section - Updated Design */}
                  <div className="lg:col-span-2 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-xl">
                            <Package className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Orders</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Track and manage your orders</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <select className="px-3 py-2 bg-white/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-700/50 rounded-lg text-sm backdrop-blur-sm text-slate-700 dark:text-slate-200">
                            <option>All Orders</option>
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {orders.length === 0 ? (
                      <div className="p-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white mb-4">
                          <Package className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No orders yet</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">Start by placing your first order</p>
                        <Link
                          to="/shop"
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-lg transition-colors"
                        >
                          Browse Products <ArrowRightIcon className="ml-2 w-4 h-4" />
                        </Link>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b border-slate-200/50 dark:border-slate-700/50">
                              <th className="px-6 py-4 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Order ID</th>
                              <th className="px-6 py-4 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Date</th>
                              <th className="px-6 py-4 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Status</th>
                              <th className="px-6 py-4 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Total</th>
                              <th className="px-6 py-4 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
                            {orders.map((order) => (
                              <tr
                                key={order._id}
                                className="group hover:bg-violet-50 dark:hover:bg-violet-500/5 transition-colors"
                              >
                                <td className="px-6 py-4">
                                  <span className="font-medium text-slate-900 dark:text-white">
                                    #{order._id.substring(0, 8)}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                  {new Date().toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                  <StatusBadge status={order.orderStatus} />
                                </td>
                                <td className="px-6 py-4">
                                  <span className="font-medium text-slate-900 dark:text-white">
                                    ₹{order.totalAmount.toLocaleString()}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button
                                    onClick={() => setTrackingId(order.trackingId)}
                                    className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-medium rounded-lg transition-colors group-hover:shadow-lg group-hover:shadow-violet-500/25"
                                  >
                                    <Truck className="w-4 h-4 mr-1.5" strokeWidth={2} />
                                    Track
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Right Sidebar */}
                  <div className="space-y-6">
                    {/* Profile Card */}
                    <div className="bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg p-6">
                      {!editMode ? (
                        <div className="flex flex-col items-center text-center p-5 rounded-lg">
                          <div className="w-20 h-20 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 text-white text-2xl font-bold">
                            {userData.name ? userData.name.charAt(0).toUpperCase() : <User className="w-10 h-10" />}
                          </div>
                          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">{userData.name}</h3>
                          <p className="text-slate-500 dark:text-slate-400 mb-5">{userData.email}</p>
                          <button
                            className="inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/25 w-full"
                            onClick={() => setEditMode(true)}
                          >
                            <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                          <div className="text-center mb-8">
                            <div className="relative inline-block mb-4">
                              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white">
                                {userData.name?.charAt(0).toUpperCase() || <User className="w-12 h-12" />}
                              </div>
                              <button
                                type="button"
                                className="absolute bottom-0 right-0 p-2 rounded-full bg-violet-600 text-white shadow-lg"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Full Name
                              </label>
                              <input
                                type="text"
                                name="name"
                                value={userData.name}
                                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 transition-all text-slate-900 dark:text-white"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Email Address
                              </label>
                              <input
                                type="email"
                                name="email"
                                value={userData.email}
                                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 transition-all text-slate-900 dark:text-white"
                              />
                            </div>
                          </div>

                          <div className="flex gap-3 pt-6">
                            <button
                              type="submit"
                              className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/25"
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditMode(false)}
                              className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

// Updated StatCard with gradients and animation
const StatCard = ({ title, value, change, isPositive, icon, delay, animate, color }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getGradient = () => {
    switch(color) {
      case 'violet': return 'from-violet-500 to-violet-600';
      case 'indigo': return 'from-indigo-500 to-indigo-600';
      case 'purple': return 'from-purple-500 to-purple-600';
      default: return 'from-violet-500 to-violet-600';
    }
  };

  return (
    <div 
      className={`p-6 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform ${
        animate ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } ${isHovered ? "-translate-y-1" : ""} border border-slate-200/50 dark:border-slate-700/50 hover:border-violet-300/50 dark:hover:border-violet-700/50 relative overflow-hidden`}
      style={{ transitionDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${getGradient()} transform transition-all duration-500 ${
          isHovered ? "rotate-6 scale-110" : ""
        }`}>
          {icon}
        </div>
        {change && (
          <div className={`flex items-center ${isPositive ? "text-emerald-500 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>
            <span className="text-sm font-medium">{change}</span>
            {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          </div>
        )}
      </div>
      <h2 className="text-lg font-medium text-slate-600 dark:text-slate-300">{title}</h2>
      <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{value}</p>
      <div className={`mt-4 h-1 w-16 bg-gradient-to-r ${getGradient()} rounded-full transition-all duration-500 ${
        isHovered ? "w-3/4" : ""
      }`}></div>
    </div>
  );
};

// Status Badge Component with consistent styling
const StatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20";
      case "Processing":
        return "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20";
      case "Shipped":
        return "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20";
      default:
        return "bg-slate-50 dark:bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-500/20";
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyles()}`}>
      <span className={`w-1 h-1 rounded-full mr-1.5 ${
        status === "Delivered" ? "bg-emerald-500" :
        status === "Processing" ? "bg-amber-500" :
        status === "Shipped" ? "bg-blue-500" :
        "bg-slate-500"
      }`}></span>
      {status}
    </span>
  );
};

export default CustomerDashboard;