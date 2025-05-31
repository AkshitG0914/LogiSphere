// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchOrders, updateOrderStatus, cancelOrder } from "../redux/orders/orderSlice";
// import { 
//   Loader, AlertCircle, CheckCircle, XCircle, ShoppingBag, 
//   Truck, Package, Search, Filter, Calendar, 
//   IndianRupee, ChartBar
// } from "lucide-react";
// import Navbar from "../components/Navbar";

// const OrderDashboard = () => {
//   const dispatch = useDispatch();
//   const { orders, loading, error } = useSelector((state) => state.orders);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [modalType, setModalType] = useState(null); // 'update' or 'cancel'
//   const [status, setStatus] = useState("");
//   const [cancelReason, setCancelReason] = useState("");
//   const [animateStats, setAnimateStats] = useState(false);
//   const [scrollY, setScrollY] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrollY(window.scrollY);
//     };
    
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     dispatch(fetchOrders());
//     setTimeout(() => setAnimateStats(true), 100);
//   }, [dispatch]);

//   const handleStatusUpdate = async () => {
//     if (!selectedOrder || !status) return;
    
//     try {
//       await dispatch(updateOrderStatus({ orderId: selectedOrder, status }));
//       alert("Order status updated successfully");
//     } catch (error) {
//       console.error("Error updating order status:", error);
//       alert("Failed to update order status");
//     }
    
//     closeModal();
//   };

//   const handleCancelOrder = async () => {
//     if (!selectedOrder || !cancelReason) return;
    
//     try {
//       await dispatch(cancelOrder({ orderId: selectedOrder, reason: cancelReason }));
//       alert("Order cancelled successfully");
//     } catch (error) {
//       console.error("Error cancelling order:", error);
//       alert("Failed to cancel order");
//     }
    
//     closeModal();
//   };

//   const openModal = (type, orderId) => {
//     const order = orders.find(o => o._id === orderId);
//     if (order?.orderStatus === "Delivered") {
//       alert("Cannot modify delivered orders");
//       return;
//     }
//     setSelectedOrder(orderId);
//     setModalType(type);
//   };

//   const closeModal = () => {
//     setSelectedOrder(null);
//     setModalType(null);
//     setStatus("");
//     setCancelReason("");
//   };

//   // Calculate summary statistics
//   const totalOrders = orders?.length || 0;
//   const pendingOrders = orders?.filter(order => order.orderStatus === "Processing").length || 0;
//   const deliveredOrders = orders?.filter(order => order.orderStatus === "Delivered").length || 0;
//   const totalRevenue = orders?.reduce((sum, order) => sum + order.totalAmount, 0) || 0;

//   // Get unique statuses for filtering
//   const statuses = ["all", ...new Set(orders.map(order => order.orderStatus))];

//   // Filter orders by search term and status
//   const filteredOrders = orders.filter((order) => {
//     const matchesSearch = order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
//                           order._id.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = filterStatus === "all" || order.orderStatus === filterStatus;
//     return matchesSearch && matchesStatus;
//   });

//   const getStatusClass = (status) => {
//     switch (status) {
//       case "Delivered":
//         return "text-emerald-600 bg-emerald-100";
//       case "Processing":
//         return "text-yellow-600 bg-yellow-100";
//       case "Shipped":
//         return "text-cyan-600 bg-cyan-100";
//       case "Cancelled":
//         return "text-red-600 bg-red-100";
//       default:
//         return "text-slate-600 bg-slate-100";
//     }
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
//       <Navbar />
//       <main className="flex-1 overflow-y-auto relative">
//         {/* Background with depth layers */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           {/* Updated background gradient to match violet/indigo theme */}
//           <div 
//             className="absolute inset-0 bg-gradient-to-br from-violet-950 via-indigo-900 to-purple-900 h-64"
//             style={{ transform: `translateY(${scrollY * 0.1}px)` }}
//           ></div>
          
//           {/* Updated geometric shapes with new color scheme */}
//           <div className="absolute inset-0 overflow-hidden opacity-20">
//             <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-violet-400 blur-3xl"
//                  style={{ transform: `translateY(${scrollY * 0.15}px)` }}></div>
//             <div className="absolute top-1/2 -left-32 w-64 h-64 rounded-full bg-indigo-500 blur-3xl"
//                  style={{ transform: `translateY(${-scrollY * 0.2}px)` }}></div>
//             <div className="absolute bottom-20 right-1/3 w-80 h-80 rounded-full bg-purple-400 blur-3xl"
//                  style={{ transform: `translateY(${-scrollY * 0.25}px)` }}></div>
//           </div>
          
//           {/* Background grid pattern */}
//           <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800/20 [mask-image:linear-gradient(to_bottom,transparent,50%,white)]"></div>
//         </div>
        
//         <div className="relative z-10 p-6">
//           <div className="max-w-7xl mx-auto">
//             {/* Header with updated design */}
//             <header className="mb-8 pt-6 text-white">
//               <div className="mb-4 inline-flex items-center px-4 py-2 rounded-full bg-violet-500/20 text-violet-200 text-sm font-medium tracking-wider">
//                 <ShoppingBag size={16} className="mr-2" />
//                 ORDER MANAGEMENT
//               </div>
//               <h1 className="text-4xl lg:text-5xl font-bold mb-2">
//                 <span className="text-zinc-50 block">Orders</span>
//                 <span className="bg-gradient-to-r from-violet-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent">
//                   Dashboard & Management
//                 </span>
//               </h1>
//               <p className="text-zinc-300 mt-2">Track, update and manage all customer orders from one place</p>
//             </header>

//             {/* Dashboard Stats */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-16">
//               <StatCard 
//                 title="Total Orders" 
//                 value={totalOrders} 
//                 change="+5.2%" 
//                 isPositive={true} 
//                 icon={<ShoppingBag size={24} className="text-white" />} 
//                 delay={0} 
//                 animate={animateStats}
//                 color="violet" 
//               />
//               <StatCard 
//                 title="Pending Orders" 
//                 value={pendingOrders} 
//                 change="-2.1%" 
//                 isPositive={false} 
//                 icon={<Package size={24} className="text-white" />} 
//                 delay={100} 
//                 animate={animateStats}
//                 color="indigo" 
//               />
//               <StatCard 
//                 title="Delivered" 
//                 value={deliveredOrders} 
//                 change="+8.3%" 
//                 isPositive={true} 
//                 icon={<Truck size={24} className="text-white" />} 
//                 delay={200} 
//                 animate={animateStats}
//                 color="purple" 
//               />
//               <StatCard 
//                 title="Total Revenue" 
//                 value={`₹${totalRevenue.toLocaleString()}`} 
//                 change="+12.5%" 
//                 isPositive={true} 
//                 icon={<IndianRupee size={24} className="text-white" />} 
//                 delay={300} 
//                 animate={animateStats}
//                 color="violet" 
//               />
//             </div>

//             {/* Control Panel with Search, Filter & Add - glassy design */}
//             <div className="bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all p-6 mb-6">
//               <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//                 <div className="w-full md:w-auto flex-1">
//                   <div className="relative">
//                     <Search className="absolute left-3 top-3 text-slate-500 dark:text-slate-400" size={18} />
//                     <input
//                       type="text"
//                       placeholder="Search by customer or order ID..."
//                       className="pl-10 pr-4 py-3 w-full rounded-lg bg-white/70 dark:bg-slate-700/70 border border-slate-200/50 dark:border-slate-700/50 shadow-sm focus:ring-violet-500 focus:border-violet-500 transition-all dark:text-white"
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                   </div>
//                 </div>

//                 <div className="w-full md:w-auto flex-1 md:max-w-xs">
//                   <select
//                     value={filterStatus}
//                     onChange={(e) => setFilterStatus(e.target.value)}
//                     className="w-full p-3 rounded-lg bg-white/70 dark:bg-slate-700/70 border border-slate-200/50 dark:border-slate-700/50 shadow-sm focus:ring-violet-500 focus:border-violet-500 transition-all dark:text-white"
//                   >
//                     {statuses.map((status) => (
//                       <option key={status} value={status}>
//                         {status === "all" ? "All Statuses" : status}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>

//             {/* Orders Table */}
//             {loading ? (
//               <div className="flex items-center justify-center h-64 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg p-6">
//                 <div className="w-16 h-16 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
//               </div>
//             ) : error ? (
//               <div className="bg-red-500/10 border border-red-500/20 text-red-500 font-semibold text-center p-8 rounded-2xl shadow-lg">
//                 Error: {error}
//               </div>
//             ) : filteredOrders.length === 0 ? (
//               <div className="bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg p-8 text-center">
//                 <ShoppingBag size={40} className="text-slate-400 dark:text-slate-500 mx-auto mb-3" />
//                 <p className="text-slate-500 dark:text-slate-400">No orders found matching your criteria.</p>
//               </div>
//             ) : (
//               <div className="bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all overflow-hidden">
//                 <table className="w-full text-left border-collapse">
//                   <thead>
//                     <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300">
//                       <th className="p-4 font-semibold">Order ID</th>
//                       <th className="p-4 font-semibold">Customer</th>
//                       <th className="p-4 font-semibold">Date</th>
//                       <th className="p-4 font-semibold">Total</th>
//                       <th className="p-4 font-semibold">Status</th>
//                       <th className="p-4 font-semibold">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredOrders.map((order) => (
//                       <tr key={order._id} className="border-t border-slate-200/50 dark:border-slate-700/50 hover:bg-violet-50/30 dark:hover:bg-violet-900/10 transition-colors">
//                         <td className="p-4 font-medium text-slate-800 dark:text-slate-200 font-mono">{order._id.substring(0, 8)}...</td>
//                         <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{order.customer.name}</td>
//                         <td className="p-4">
//                           <div className="flex items-center text-slate-600 dark:text-slate-400">
//                             <Calendar size={16} className="mr-2" />
//                             {new Date(order.createdAt).toLocaleDateString()}
//                           </div>
//                         </td>
//                         <td className="p-4 font-medium text-slate-800 dark:text-slate-200">
//                           <div className="flex items-center">
//                             <IndianRupee size={16} className="mr-1" />
//                             {order.totalAmount.toLocaleString()}
//                           </div>
//                         </td>
//                         <td className="p-4">
//                           <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(order.orderStatus)}`}>
//                             {order.orderStatus}
//                           </span>
//                         </td>
//                         <td className="p-4">
//                           <div className="flex space-x-2">
//                             {order.orderStatus !== "Delivered" ? (
//                               <>
//                                 <button
//                                   onClick={() => openModal('update', order._id)}
//                                   className="p-2 bg-gradient-to-r from-violet-500 to-indigo-600 text-white rounded-lg hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
//                                   title="Update Status"
//                                 >
//                                   <CheckCircle size={16} />
//                                 </button>
//                                 <button
//                                   onClick={() => openModal('cancel', order._id)}
//                                   className="p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
//                                   title="Cancel Order"
//                                 >
//                                   <XCircle size={16} />
//                                 </button>
//                               </>
//                             ) : (
//                               <span className="text-sm text-slate-500 dark:text-slate-400">
//                                 Order completed
//                               </span>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>

//       {/* Update Status Modal - glassy design */}
//       {selectedOrder && modalType === 'update' && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
//           <div className="bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl p-6 rounded-2xl shadow-xl max-w-md w-full border border-slate-200/50 dark:border-slate-700/50">
//             <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Update Order Status</h2>
//             <p className="text-slate-600 dark:text-slate-300 mb-4">Select a new status for this order</p>
//             <select
//               value={status}
//               onChange={(e) => setStatus(e.target.value)}
//               className="w-full p-3 rounded-lg bg-white/70 dark:bg-slate-700/70 border border-slate-200/50 dark:border-slate-700/50 shadow-sm focus:ring-violet-500 focus:border-violet-500 transition-all dark:text-white"
//             >
//               <option value="">Select Status</option>
//               <option value="Processing">Processing</option>
//               <option value="Shipped">Shipped</option>
//               <option value="Delivered">Delivered</option>
//             </select>
//             <p className="text-xs text-amber-500 mt-2">
//               Note: Once an order is marked as Delivered, it cannot be modified.
//             </p>
//             <div className="mt-6 flex justify-end space-x-3">
//               <button
//                 onClick={closeModal}
//                 className="px-4 py-2 border border-slate-200/50 dark:border-slate-700/50 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleStatusUpdate}
//                 className="px-4 py-2 bg-gradient-to-r from-violet-500 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg hover:shadow-violet-500/30 transition-all duration-300 transform hover:-translate-y-1"
//                 disabled={!status}
//               >
//                 Update Status
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Cancel Order Modal - glassy design */}
//       {selectedOrder && modalType === 'cancel' && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
//           <div className="bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl p-6 rounded-2xl shadow-xl max-w-md w-full border border-slate-200/50 dark:border-slate-700/50">
//             <h2 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">Cancel Order</h2>
//             <p className="text-slate-600 dark:text-slate-300 mb-4">Please provide a reason for cancellation</p>
//             <textarea
//               value={cancelReason}
//               onChange={(e) => setCancelReason(e.target.value)}
//               className="w-full p-3 rounded-lg bg-white/70 dark:bg-slate-700/70 border border-slate-200/50 dark:border-slate-700/50 shadow-sm focus:ring-red-500 focus:border-red-500 transition-all dark:text-white min-h-24"
//               placeholder="Enter cancellation reason"
//             />
//             <div className="mt-6 flex justify-end space-x-3">
//               <button
//                 onClick={closeModal}
//                 className="px-4 py-2 border border-slate-200/50 dark:border-slate-700/50 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
//               >
//                 Go Back
//               </button>
//               <button
//                 onClick={handleCancelOrder}
//                 className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-md hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 transform hover:-translate-y-1"
//                 disabled={!cancelReason}
//               >
//                 Confirm Cancellation
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // StatCard Component - matched to Dashboard version
// const StatCard = ({ title, value, change, isPositive, icon, delay, animate, color }) => {
//   const [isHovered, setIsHovered] = useState(false);

//   const getGradient = () => {
//     switch(color) {
//       case 'violet': return 'from-violet-500 to-violet-600';
//       case 'indigo': return 'from-indigo-500 to-indigo-600';
//       case 'purple': return 'from-purple-500 to-purple-600';
//       default: return 'from-violet-500 to-violet-600';
//     }
//   };

//   return (
//     <div 
//       className={`p-6 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform ${
//         animate ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
//       } ${isHovered ? "-translate-y-1" : ""} border border-slate-200/50 dark:border-slate-700/50 hover:border-violet-300/50 dark:hover:border-violet-700/50 relative overflow-hidden`}
//       style={{ transitionDelay: `${delay}ms` }}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <div className="flex justify-between items-start mb-4">
//         <div className={`p-3 rounded-lg bg-gradient-to-r ${getGradient()} transform transition-all duration-500 ${
//           isHovered ? "rotate-6 scale-110" : ""
//         }`}>
//           {icon}
//         </div>
//         <div className={`flex items-center ${isPositive ? "text-emerald-500 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>
//           <span className="text-sm font-medium">{change}</span>
//           {isPositive ? (
//             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right">
//               <path d="M7 7h10v10" />
//               <path d="M7 17 17 7" />
//             </svg>
//           ) : (
//             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-down-right">
//               <path d="M7 7 17 17" />
//               <path d="M17 7v10H7" />
//             </svg>
//           )}
//         </div>
//       </div>
//       <h2 className="text-lg font-medium text-slate-600 dark:text-slate-300">{title}</h2>
//       <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{value}</p>
//       <div className={`mt-4 h-1 w-16 bg-gradient-to-r ${getGradient()} rounded-full transition-all duration-500 ${
//         isHovered ? "w-3/4" : ""
//       }`}></div>
//     </div>
//   );
// };

// export default OrderDashboard;

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, updateOrderStatus, cancelOrder } from "../redux/orders/orderSlice";
import { 
  Loader, AlertCircle, CheckCircle, XCircle, ShoppingBag, 
  Truck, Package, Search, Filter, Calendar, 
  IndianRupee, ChartBar
} from "lucide-react";
import Navbar from "../components/Navbar";

const OrderDashboard = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalType, setModalType] = useState(null); // 'update' or 'cancel'
  const [status, setStatus] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [animateStats, setAnimateStats] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    dispatch(fetchOrders());
    setTimeout(() => setAnimateStats(true), 100);
  }, [dispatch]);

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !status) return;
    
    try {
      await dispatch(updateOrderStatus({ orderId: selectedOrder, status }));
      alert("Order status updated successfully");
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    }
    
    closeModal();
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder || !cancelReason) return;
    
    try {
      await dispatch(cancelOrder({ orderId: selectedOrder, reason: cancelReason }));
      alert("Order cancelled successfully");
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel order");
    }
    
    closeModal();
  };

  const openModal = (type, orderId) => {
    setSelectedOrder(orderId);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setModalType(null);
    setStatus("");
    setCancelReason("");
  };

  // Calculate summary statistics
  const totalOrders = orders?.length || 0;
  const pendingOrders = orders?.filter(order => order.orderStatus === "Processing").length || 0;
  const deliveredOrders = orders?.filter(order => order.orderStatus === "Delivered").length || 0;
  const totalRevenue = orders?.reduce((sum, order) => sum + order.totalAmount, 0) || 0;

  // Get unique statuses for filtering
  const statuses = ["all", ...new Set(orders.map(order => order.orderStatus))];

  // Filter orders by search term and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order._id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || order.orderStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "text-emerald-600 bg-emerald-100";
      case "Processing":
        return "text-yellow-600 bg-yellow-100";
      case "Shipped":
        return "text-cyan-600 bg-cyan-100";
      case "Cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-slate-600 bg-slate-100";
    }
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
          
          {/* Background grid pattern */}
          <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800/20 [mask-image:linear-gradient(to_bottom,transparent,50%,white)]"></div>
        </div>
        
        <div className="relative z-10 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header with updated design */}
            <header className="mb-8 pt-6 text-white">
              <div className="mb-4 inline-flex items-center px-4 py-2 rounded-full bg-violet-500/20 text-violet-200 text-sm font-medium tracking-wider">
                <ShoppingBag size={16} className="mr-2" />
                ORDER MANAGEMENT
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-2">
                <span className="text-zinc-50 block">Orders</span>
                <span className="bg-gradient-to-r from-violet-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent">
                  Dashboard & Management
                </span>
              </h1>
              <p className="text-zinc-300 mt-2">Track, update and manage all customer orders from one place</p>
            </header>

            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-16">
              <StatCard 
                title="Total Orders" 
                value={totalOrders} 
                change="+5.2%" 
                isPositive={true} 
                icon={<ShoppingBag size={24} className="text-white" />} 
                delay={0} 
                animate={animateStats}
                color="violet" 
              />
              <StatCard 
                title="Pending Orders" 
                value={pendingOrders} 
                change="-2.1%" 
                isPositive={false} 
                icon={<Package size={24} className="text-white" />} 
                delay={100} 
                animate={animateStats}
                color="indigo" 
              />
              <StatCard 
                title="Delivered" 
                value={deliveredOrders} 
                change="+8.3%" 
                isPositive={true} 
                icon={<Truck size={24} className="text-white" />} 
                delay={200} 
                animate={animateStats}
                color="purple" 
              />
              <StatCard 
                title="Total Revenue" 
                value={`₹${totalRevenue.toLocaleString()}`} 
                change="+12.5%" 
                isPositive={true} 
                icon={<IndianRupee size={24} className="text-white" />} 
                delay={300} 
                animate={animateStats}
                color="violet" 
              />
            </div>

            {/* Control Panel with Search, Filter & Add - glassy design */}
            <div className="bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all p-6 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="w-full md:w-auto flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 text-slate-500 dark:text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search by customer or order ID..."
                      className="pl-10 pr-4 py-3 w-full rounded-lg bg-white/70 dark:bg-slate-700/70 border border-slate-200/50 dark:border-slate-700/50 shadow-sm focus:ring-violet-500 focus:border-violet-500 transition-all dark:text-white"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="w-full md:w-auto flex-1 md:max-w-xs">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full p-3 rounded-lg bg-white/70 dark:bg-slate-700/70 border border-slate-200/50 dark:border-slate-700/50 shadow-sm focus:ring-violet-500 focus:border-violet-500 transition-all dark:text-white"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status === "all" ? "All Statuses" : status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Orders Table */}
            {loading ? (
              <div className="flex items-center justify-center h-64 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg p-6">
                <div className="w-16 h-16 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 font-semibold text-center p-8 rounded-2xl shadow-lg">
                Error: {error}
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg p-8 text-center">
                <ShoppingBag size={40} className="text-slate-400 dark:text-slate-500 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400">No orders found matching your criteria.</p>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300">
                      <th className="p-4 font-semibold">Order ID</th>
                      <th className="p-4 font-semibold">Customer</th>
                      <th className="p-4 font-semibold">Date</th>
                      <th className="p-4 font-semibold">Total</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order._id} className="border-t border-slate-200/50 dark:border-slate-700/50 hover:bg-violet-50/30 dark:hover:bg-violet-900/10 transition-colors">
                        <td className="p-4 font-medium text-slate-800 dark:text-slate-200 font-mono">{order._id.substring(0, 8)}...</td>
                        <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{order.customer.name}</td>
                        <td className="p-4">
                          <div className="flex items-center text-slate-600 dark:text-slate-400">
                            <Calendar size={16} className="mr-2" />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="p-4 font-medium text-slate-800 dark:text-slate-200">
                          <div className="flex items-center">
                            <IndianRupee size={16} className="mr-1" />
                            {order.totalAmount.toLocaleString()}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openModal('update', order._id)}
                              className="p-2 bg-gradient-to-r from-violet-500 to-indigo-600 text-white rounded-lg hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                              title="Update Status"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => openModal('cancel', order._id)}
                              className="p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                              title="Cancel Order"
                            >
                              <XCircle size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Update Status Modal - glassy design */}
      {selectedOrder && modalType === 'update' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl p-6 rounded-2xl shadow-xl max-w-md w-full border border-slate-200/50 dark:border-slate-700/50">
            <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Update Order Status</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">Select a new status for this order</p>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/70 dark:bg-slate-700/70 border border-slate-200/50 dark:border-slate-700/50 shadow-sm focus:ring-violet-500 focus:border-violet-500 transition-all dark:text-white"
            >
              <option value="">Select Status</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-slate-200/50 dark:border-slate-700/50 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                className="px-4 py-2 bg-gradient-to-r from-violet-500 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg hover:shadow-violet-500/30 transition-all duration-300 transform hover:-translate-y-1"
                disabled={!status}
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Modal - glassy design */}
      {selectedOrder && modalType === 'cancel' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl p-6 rounded-2xl shadow-xl max-w-md w-full border border-slate-200/50 dark:border-slate-700/50">
            <h2 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">Cancel Order</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">Please provide a reason for cancellation</p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/70 dark:bg-slate-700/70 border border-slate-200/50 dark:border-slate-700/50 shadow-sm focus:ring-red-500 focus:border-red-500 transition-all dark:text-white min-h-24"
              placeholder="Enter cancellation reason"
            />
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-slate-200/50 dark:border-slate-700/50 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={handleCancelOrder}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-md hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 transform hover:-translate-y-1"
                disabled={!cancelReason}
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// StatCard Component - matched to Dashboard version
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

export default OrderDashboard;