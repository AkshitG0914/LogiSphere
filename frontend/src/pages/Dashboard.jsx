import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminData, fetchRevenueAnalytics } from "../redux/admin/adminSlice";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Users, Package, IndianRupee, Archive, ChartBar } from "lucide-react";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { orders, revenue = 0, users, stock = 0, loading, error } = useSelector(
    (state) => state.admin || {}
  );
  const { revenueData = [], loadingnew } = useSelector((state) => state.admin);
  
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
    const fetchData = async () => {
      try {
        await dispatch(fetchAdminData());
        await dispatch(fetchRevenueAnalytics());
        setTimeout(() => setAnimateStats(true), 100);
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
      }
    };
    
    fetchData();
  }, [dispatch]);
  
  // Calculate total users - handle both array of users and direct number
  const totalUsers = Array.isArray(users) ? users.length : (typeof users === 'number' ? users : 0);

  // Add data validation for revenue data
  const isValidRevenueData = Array.isArray(revenueData) && revenueData.length > 0;

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
          
          {/* Adding background grid pattern like in CustomerOrder */}
          <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800/20 [mask-image:linear-gradient(to_bottom,transparent,50%,white)]"></div>
        </div>
        
        <div className="relative z-10 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header with updated design */}
            <header className="mb-8 pt-6 text-white">
              <div className="mb-4 inline-flex items-center px-4 py-2 rounded-full bg-violet-500/20 text-violet-200 text-sm font-medium tracking-wider">
                <ChartBar size={16} className="mr-2" />
                ADMIN CONTROL CENTER
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-2">
                <span className="text-zinc-50 block">Dashboard</span>
                <span className="bg-gradient-to-r from-violet-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent">
                  Analytics & Insights
                </span>
              </h1>
              <p className="text-zinc-300 mt-2">Welcome back! Here's an overview of your business performance</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-16">
                  <StatCard 
                    title="Total Orders" 
                    value={typeof orders === 'number' ? orders : 0} 
                    change="+12.5%" 
                    isPositive={true} 
                    icon={<Package size={24} className="text-white" />} 
                    delay={0} 
                    animate={animateStats}
                    color="violet" 
                  />
                  <StatCard 
                    title="Total Revenue" 
                    value={`₹${(typeof revenue === 'number' ? revenue : 0).toLocaleString()}`} 
                    change="+8.2%" 
                    isPositive={true} 
                    icon={<IndianRupee size={24} className="text-white" />} 
                    delay={100} 
                    animate={animateStats}
                    color="indigo" 
                  />
                  <StatCard 
                    title="Total Users" 
                    value={totalUsers} 
                    change="+5.3%" 
                    isPositive={true} 
                    icon={<Users size={24} className="text-white" />} 
                    delay={200} 
                    animate={animateStats}
                    color="purple" 
                  />
                  <StatCard 
                    title="Available Stock" 
                    value={typeof stock === 'number' ? stock : 0} 
                    change="-2.4%" 
                    isPositive={false} 
                    icon={<Archive size={24} className="text-white" />} 
                    delay={300} 
                    animate={animateStats}
                    color="violet" 
                  />
                </div>

                {/* Chart cards updated with glassy design */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  <ChartCard 
                    title="Sales Analytics" 
                    subtitle="Monthly revenue from orders" 
                    chartType="bar" 
                    data={revenueData} 
                    loading={loadingnew}
                    className="lg:col-span-2" 
                  />
                  <ChartCard 
                    title="Revenue Trend" 
                    subtitle="Last 6 months" 
                    chartType="line" 
                    data={revenueData} 
                    loading={loadingnew} 
                  />
                </div>

                {/* Quick Actions card updated with glassy design */}
                <div className="bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg p-6 mb-8">
                  <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Run Reports", icon: <TrendingUp size={20} /> },
                      { label: "Manage Inventory", icon: <Archive size={20} /> },
                      { label: "User Analytics", icon: <Users size={20} /> },
                      { label: "Order Processing", icon: <Package size={20} /> },
                    ].map((action, index) => (
                      <button 
                        key={index}
                        className="flex items-center justify-center gap-2 p-4 bg-gradient-to-br from-white/60 to-white/30 dark:from-slate-800/60 dark:to-slate-800/30 hover:from-violet-50/60 hover:to-violet-50/30 dark:hover:from-slate-700/60 dark:hover:to-slate-700/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:border-violet-300/50 dark:hover:border-violet-700/50 transition-all hover:shadow-md group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white transform transition-all duration-300 group-hover:rotate-6">
                          {action.icon}
                        </div>
                        <span className="font-medium text-slate-700 dark:text-slate-200">{action.label}</span>
                      </button>
                    ))}
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

const ChartCard = ({ title, subtitle, chartType, data, loading, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeBarIndex, setActiveBarIndex] = useState(null);

  // Custom tooltip component for improved visualization
  const CustomBarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="text-lg font-semibold text-violet-600 dark:text-violet-400">{`₹${payload[0].value.toLocaleString()}`}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{payload[0].payload.month}</p>
        </div>
      );
    }
    return null;
  };

  const handleBarMouseOver = (data, index) => {
    setActiveBarIndex(index);
  };

  const handleBarMouseLeave = () => {
    setActiveBarIndex(null);
  };

  // Generate custom colors for bars
  const getBarColor = (entry, index) => {
    // If this bar is being hovered, use a more vibrant gradient
    if (index === activeBarIndex) {
      return [
        { offset: '0%', color: '#a855f7', opacity: 1 },  // More vibrant violet
        { offset: '100%', color: '#8b5cf6', opacity: 1 } // More vibrant purple
      ];
    }
    
    // Otherwise use normal gradients with some variety based on index
    const baseHue = 260; // Violet base hue
    const hueVariation = index * 5; // Slight hue variation
    
    return [
      { offset: '0%', color: `hsl(${baseHue + hueVariation}, 70%, 65%)`, opacity: 0.9 },
      { offset: '100%', color: `hsl(${baseHue + hueVariation - 15}, 75%, 60%)`, opacity: 0.9 }
    ];
  };

  return (
    <div 
      className={`p-6 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl rounded-2xl hover:shadow-xl transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50 hover:border-violet-300/50 dark:hover:border-violet-700/50 shadow-lg ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white">{title}</h2>
          <p className="text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>
        <div className={`p-2 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-600 text-white transform transition-all duration-500 ${isHovered ? "rotate-6 scale-110" : ""}`}>
          <ChartBar size={20} />
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-10 h-10 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-slate-500 dark:text-slate-400">No data available</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          {chartType === "bar" ? (
            <BarChart 
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
              barCategoryGap="20%"
              onMouseLeave={handleBarMouseLeave}
            >
              <defs>
                {data.map((entry, index) => (
                  <linearGradient 
                    key={`barGradient-${index}`} 
                    id={`barGradient-${index}`} 
                    x1="0" 
                    y1="0" 
                    x2="0" 
                    y2="1"
                  >
                    {getBarColor(entry, index).map((color, colorIndex) => (
                      <stop 
                        key={`color-${index}-${colorIndex}`}
                        offset={color.offset} 
                        stopColor={color.color} 
                        stopOpacity={color.opacity}
                      />
                    ))}
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke="#e2e8f080" 
                className="dark:opacity-20"
              />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                dy={10}
                padding={{ left: 10, right: 10 }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                width={60}
                tickFormatter={(value) => `₹${value > 999 ? `${(value / 1000).toFixed(0)}K` : value}`}
              />
              <Tooltip content={<CustomBarTooltip />} cursor={{fill: 'transparent'}} />
              <Bar 
                dataKey="revenue" 
                radius={[8, 8, 0, 0]}
                onMouseOver={(data, index) => handleBarMouseOver(data, index)}
                className="transition-all duration-300"
              >
                {data.map((entry, index) => (
                  <rect 
                    key={`bar-${index}`}
                    fill={`url(#barGradient-${index})`}
                    className={`transition-all duration-300 ${index === activeBarIndex ? 'filter drop-shadow-lg' : ''}`}
                    style={{
                      filter: index === activeBarIndex ? 'drop-shadow(0px 4px 6px rgba(139, 92, 246, 0.3))' : 'none',
                      transform: index === activeBarIndex ? 'scale(1.03, 1)' : 'none',
                      transformOrigin: 'bottom'
                    }}
                  />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f080" className="dark:opacity-20" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                width={60}
                tickFormatter={(value) => `₹${value > 999 ? `${(value / 1000).toFixed(0)}K` : value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  borderRadius: '0.5rem',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
              />
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={1}/>
                </linearGradient>
                <filter id="glow" height="300%" width="300%" x="-100%" y="-100%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feColorMatrix
                    in="blur"
                    type="matrix"
                    values="0 0 0 0 0.545 0 0 0 0 0.360 0 0 0 0 0.965 0 0 0 1 0"
                    result="glow"
                  />
                  <feBlend in="SourceGraphic" in2="glow" mode="normal" />
                </filter>
              </defs>
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="url(#colorRevenue)" 
                strokeWidth={3} 
                dot={{ r: 6, strokeWidth: 3, fill: "white", stroke: "#8b5cf6" }} 
                activeDot={{ 
                  r: 8, 
                  strokeWidth: 3, 
                  fill: "white", 
                  stroke: "#8b5cf6",
                  filter: "url(#glow)"
                }}
                style={{ filter: "drop-shadow(0px 2px 2px rgba(139, 92, 246, 0.3))" }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default AdminDashboard;