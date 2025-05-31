import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInventory, removeProduct } from "../redux/inventory/inventorySlice";
import AddProductModal from "../components/AddProductModal";
import EditProductModal from "../components/EditProductModal";
import { Pencil, Trash, Plus, Search, Package, Filter, RefreshCw, IndianRupee, Archive, ChartBar } from "lucide-react";

const InventoryDashboard = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.inventory);
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
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
    dispatch(fetchInventory());
    setTimeout(() => setAnimateStats(true), 100);
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!id) {
      console.error("Error: Missing product ID");
      return;
    }
  
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;
  
    try {
      await dispatch(removeProduct(id));
      alert("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };
  
  // Get unique categories
  const categories = ["all", ...new Set(items.map(item => item.category))];

  // Filter items by search term and category
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getStockClass = (stock) => {
    if (stock <= 5) return "text-red-600 bg-red-100";
    if (stock <= 20) return "text-yellow-600 bg-yellow-100";
    return "text-emerald-600 bg-emerald-100";
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
      <Navbar />
      <main className="flex-1 overflow-y-auto relative">
        {/* Background with depth layers */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Background gradient to match violet/indigo theme from Dashboard */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-violet-950 via-indigo-900 to-purple-900 h-64"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          ></div>
          
          {/* Geometric shapes with matching color scheme */}
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
                <Package size={16} className="mr-2" />
                INVENTORY MANAGEMENT
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-2">
                <span className="text-zinc-50 block">Inventory</span>
                <span className="bg-gradient-to-r from-violet-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent">
                  Dashboard & Management
                </span>
              </h1>
              <p className="text-zinc-300 mt-2">Track your products, monitor stock levels, and manage your inventory efficiently</p>
            </header>

            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-16">
              <StatCard 
                title="Total Products" 
                value={items.length} 
                change="+3.5%" 
                isPositive={true} 
                icon={<Package size={24} className="text-white" />} 
                delay={0} 
                animate={animateStats}
                color="violet" 
              />
              <StatCard 
                title="Low Stock Items" 
                value={items.filter(item => item.stock <= 5).length} 
                change="+2.4%" 
                isPositive={false} 
                icon={<RefreshCw size={24} className="text-white" />} 
                delay={100} 
                animate={animateStats}
                color="indigo" 
              />
              <StatCard 
                title="Categories" 
                value={new Set(items.map(item => item.category)).size} 
                change="+1.8%" 
                isPositive={true} 
                icon={<Filter size={24} className="text-white" />} 
                delay={200} 
                animate={animateStats}
                color="purple" 
              />
              <StatCard 
                title="Total Value" 
                value={`₹${items.reduce((sum, item) => sum + (item.price * item.stock), 0).toLocaleString()}`} 
                change="+7.2%" 
                isPositive={true} 
                icon={<IndianRupee size={24} className="text-white" />} 
                delay={300} 
                animate={animateStats}
                color="violet" 
              />
            </div>

            {/* Control Panel with Search, Filter & Add - updated with glassy design */}
            <div className="bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all p-6 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="w-full md:w-auto flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 text-slate-500 dark:text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="pl-10 pr-4 py-3 w-full rounded-lg bg-white/70 dark:bg-slate-700/70 border border-slate-200/50 dark:border-slate-700/50 shadow-sm focus:ring-violet-500 focus:border-violet-500 transition-all dark:text-white"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="w-full md:w-auto flex-1 md:max-w-xs">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full p-3 rounded-lg bg-white/70 dark:bg-slate-700/70 border border-slate-200/50 dark:border-slate-700/50 shadow-sm focus:ring-violet-500 focus:border-violet-500 transition-all dark:text-white"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Only Admin & Warehouse Manager Can Add Products */}
                {user?.role === "admin" || user?.role === "warehouse_manager" ? (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-violet-500 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg hover:shadow-violet-500/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
                  >
                    <Plus size={18} className="mr-2" /> Add New Product
                  </button>
                ) : null}
              </div>
            </div>

            {/* Inventory Table */}
            {loading ? (
              <div className="flex items-center justify-center h-64 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg p-6">
                <div className="w-16 h-16 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 font-semibold text-center p-8 rounded-2xl shadow-lg">
                Error: {error}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg p-8 text-center">
                <Package size={40} className="text-slate-400 dark:text-slate-500 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400">No products found matching your criteria.</p>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300">
                      <th className="p-4 font-semibold">Product Name</th>
                      <th className="p-4 font-semibold">Category</th>
                      <th className="p-4 font-semibold">Stock</th>
                      <th className="p-4 font-semibold">Price</th>
                      {user?.role === "admin" || user?.role === "warehouse_manager" ? <th className="p-4 font-semibold">Actions</th> : null}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((product) => (
                      <tr key={product._id} className="border-t border-slate-200/50 dark:border-slate-700/50 hover:bg-violet-50/30 dark:hover:bg-violet-900/10 transition-colors">
                        <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{product.name}</td>
                        <td className="p-4">
                          <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200 rounded-full text-xs font-medium">
                            {product.category}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStockClass(product.stock)}`}>
                            {product.stock} units
                          </span>
                        </td>
                        <td className="p-4 font-medium text-slate-800 dark:text-slate-200">₹{product.price.toLocaleString()}</td>
                        {user?.role === "admin" || user?.role === "warehouse_manager" ? (
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setEditProduct(product)}
                                className="p-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-lg hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                                title="Edit Product"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(product._id)}
                                className="p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                                title="Delete Product"
                              >
                                <Trash size={16} />
                              </button>
                            </div>
                          </td>
                        ) : null}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals for Add/Edit Product */}
      {showAddModal && <AddProductModal onClose={() => setShowAddModal(false)} />}
      {editProduct && <EditProductModal product={editProduct} onClose={() => setEditProduct(null)} />}
    </div>
  );
};

// StatCard Component - updated to match Dashboard.jsx version
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
          {isPositive ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right">
              <path d="M7 7h10v10" />
              <path d="M7 17 17 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-down-right">
              <path d="M7 7 17 17" />
              <path d="M17 7v10H7" />
            </svg>
          )}
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

export default InventoryDashboard;