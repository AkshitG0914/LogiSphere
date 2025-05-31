import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, toggleUserStatus } from "../redux/admin/adminSlice";
import { 
  Users, Mail, ShieldCheck, XCircle, Search, Filter, 
  MoreHorizontal, ArrowUpRight, ArrowDownRight, UserPlus, 
  User, ChartBar, TrendingUp, Shield, Truck
} from "lucide-react";
import Navbar from "../components/Navbar";

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { users = [], loading, error } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState("");
  const [animateStats, setAnimateStats] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    dispatch(fetchUsers());
    setTimeout(() => setAnimateStats(true), 100);
  }, [dispatch]);

  // Filter users based on search term
  const filteredUsers = Array.isArray(users) 
    ? users.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Calculate stats
  const totalUsers = filteredUsers.length;
  const adminUsers = filteredUsers.filter(user => user.isAdmin).length;
  const activeUsers = filteredUsers.filter(user => user.isActive).length;

  // Add function to handle user status toggle
  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      await dispatch(toggleUserStatus({ userId, status: !currentStatus }));
    } catch (error) {
      console.error("Error toggling user status:", error);
    }
  };

  // StatCard Component - updated to match Dashboard style
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
          <div className={`flex items-center ${isPositive ? "text-emerald-500 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>
            <span className="text-sm font-medium">{change}</span>
            {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          </div>
        </div>
        <h2 className="text-lg font-medium text-slate-600 dark:text-slate-300">{title}</h2>
        <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{value}</p>
        <div className={`mt-4 h-1 w-16 bg-gradient-to-r ${getGradient()} rounded-full transition-all duration-500 ${
          isHovered ? "w-3/4" : ""
        }`}></div>
      </div>
    );
  };

  // Updated format role function
  const formatRole = (role) => {
    if (!role) return 'User';
    
    const formatMap = {
      'admin': 'Admin',
      'warehouse_manager': 'Warehouse Manager',
      'driver': 'Driver',
      'customer': 'Customer',
      'user': 'User'
    };

    // First try the map, then format the string manually
    return formatMap[role.toLowerCase()] || 
           role.split('_')
               .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
               .join(' ');
  };

  // Update the role button styling based on role
  const getRoleStyle = (role) => {
    const styleMap = {
      'admin': 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
      'warehouse_manager': 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      'driver': 'bg-green-500/10 text-green-600 dark:text-green-400',
      'customer': 'bg-slate-500/10 text-slate-600 dark:text-slate-400'
    };
    return styleMap[role?.toLowerCase()] || styleMap.customer;
  };

  // Replace the role and status display in the user row
  const renderUserRow = (user) => (
    <tr 
      key={user._id} 
      className="border-t border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
    >
      <td className="py-3 px-6 font-medium text-slate-900 dark:text-white">{user.name}</td>
      <td className="py-3 px-6 flex items-center gap-2 text-slate-600 dark:text-slate-400">
        <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500" />
        {user.email}
      </td>
      <td className="py-3 px-6">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleStyle(user.role)}`}>
          {formatRole(user.role)}
        </span>
      </td>
      <td className="py-3 px-6">
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full ${user.active ? 'bg-emerald-500' : 'bg-rose-500'} mr-2`}></div>
          <span className={`text-sm font-medium ${
            user.active ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
          }`}>
            {user.active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
      <Navbar />
      
      <main className="flex-1 overflow-y-auto relative">
        {/* Background with depth layers */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Background gradient */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-violet-950 via-indigo-900 to-purple-900 h-64"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          ></div>
          
          {/* Geometric shapes */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-violet-400 blur-3xl"
                 style={{ transform: `translateY(${scrollY * 0.15}px)` }}></div>
            <div className="absolute top-1/2 -left-32 w-64 h-64 rounded-full bg-indigo-500 blur-3xl"
                 style={{ transform: `translateY(${-scrollY * 0.2}px)` }}></div>
            <div className="absolute bottom-20 right-1/3 w-80 h-80 rounded-full bg-purple-400 blur-3xl"
                 style={{ transform: `translateY(${-scrollY * 0.25}px)` }}></div>
          </div>
          
          {/* Background grid pattern */}
          <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800/20 [mask-image:linear-gradient(to_bottom,transparent,50%,white)]"></div>
        </div>
        
        <div className="relative z-10 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header with updated design */}
            <header className="mb-8 pt-6 text-white">
              <div className="mb-4 inline-flex items-center px-4 py-2 rounded-full bg-violet-500/20 text-violet-200 text-sm font-medium tracking-wider">
                <Users size={16} className="mr-2" />
                USER MANAGEMENT
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-2">
                <span className="text-zinc-50 block">User Control</span>
                <span className="bg-gradient-to-r from-violet-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent">
                  Manage System Users
                </span>
              </h1>
              <p className="text-zinc-300 mt-2">View and manage all user accounts in your system</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-16">
              <StatCard 
                title="Total Users" 
                value={totalUsers} 
                change="+5.3%" 
                isPositive={true} 
                icon={<Users size={24} className="text-white" />} 
                delay={0} 
                animate={animateStats} 
                color="violet" 
              />
              <StatCard 
                title="Admin Users" 
                value={adminUsers} 
                change="+2.1%" 
                isPositive={true} 
                icon={<ShieldCheck size={24} className="text-white" />} 
                delay={100} 
                animate={animateStats} 
                color="indigo" 
              />
              <StatCard 
                title="Active Accounts" 
                value={`${activeUsers}/${totalUsers}`} 
                change="+7.4%" 
                isPositive={true} 
                icon={<Mail size={24} className="text-white" />} 
                delay={200} 
                animate={animateStats} 
                color="purple" 
              />
            </div>

            {/* Main Content - Now full width */}
            <div className="bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
              <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-xl text-white">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">User List</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Manage your system users</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="text"
                        placeholder="Search users..."
                        className="pl-10 pr-4 py-2 bg-white/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-700/50 rounded-lg text-sm backdrop-blur-sm text-slate-700 dark:text-slate-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <button className="p-2 bg-white/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-700/50 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors">
                      <Filter size={16} />
                    </button>
                    <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white rounded-lg shadow-sm transition-colors">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add User
                    </button>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="w-16 h-16 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
                </div>
              ) : error ? (
                <div className="m-6 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 p-4 rounded-xl flex items-center">
                  <XCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                  <p className="font-medium">Error loading users: {error}</p>
                </div>
              ) : !Array.isArray(users) || users.length === 0 ? (
                <div className="p-16 text-center">
                  <User className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No Users Found</h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    There are no users matching your criteria. Try adjusting your search or add a new user.
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                          <th className="py-3 px-6 font-medium text-slate-600 dark:text-slate-300">Name</th>
                          <th className="py-3 px-6 font-medium text-slate-600 dark:text-slate-300">Email</th>
                          <th className="py-3 px-6 font-medium text-slate-600 dark:text-slate-300">Role</th>
                          <th className="py-3 px-6 font-medium text-slate-600 dark:text-slate-300">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map(renderUserRow)}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between p-4 border-t border-slate-200/50 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-800/30">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Showing {filteredUsers.length} of {totalUsers} users</p>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Previous</button>
                      <button className="px-3 py-1.5 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white rounded-lg text-sm transition-colors">Next</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;