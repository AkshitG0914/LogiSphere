// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { MapContainer, TileLayer, Marker, Popup as MapPopup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import { Package, ChartBar, MapPin, TrendingUp } from "lucide-react";
// import { fetchDriverData, updateDriverOrder } from "../redux/driver/driverSlice"; // Import Redux actions

// const DriverDashboard = () => {
//   const dispatch = useDispatch();
//   const { 
//     deliveries, 
//     loading, 
//     error,
//     totalDistance,
//     onTimeRate
//   } = useSelector((state) => state.driver); // Get state from Redux

//   const [selectedDelivery, setSelectedDelivery] = useState(null);
//   const [showMap, setShowMap] = useState(false);
//   const [animateStats, setAnimateStats] = useState(false);
//   const [scrollY, setScrollY] = useState(0);

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrollY(window.scrollY);
//     };
    
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     // Use the Redux action instead of direct axios call
//     dispatch(fetchDriverData());
//     setTimeout(() => setAnimateStats(true), 100);
//   }, [dispatch]);

//   const customIcon = L.icon({
//     iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
//     iconSize: [25, 41],
//     iconAnchor: [12, 41],
//   });

//   // Calculate delivery statistics
//   const completedDeliveries = deliveries?.filter(d => d.status === 'Completed').length || 0;
//   const inTransitDeliveries = deliveries?.filter(d => d.status === 'In Transit').length || 0;
//   const scheduledDeliveries = deliveries?.filter(d => d.status === 'Scheduled').length || 0;

//   // Handler to update delivery status
//   const handleUpdateStatus = (deliveryId, newStatus, location, otp) => {
//     dispatch(updateDriverOrder({ deliveryId, status: newStatus, location, otp }));
//   };

//   return (
//     <div className="flex h-screen bg-zinc-50 font-sans">
//       <main className="flex-1 overflow-y-auto relative">
//         {/* Background with depth layers */}
//         <div 
//           className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-teal-900 to-cyan-900 h-64"
//           style={{ transform: `translateY(${scrollY * 0.1}px)` }}
//         >
//           {/* Geometric shapes for modern aesthetic */}
//           <div className="absolute inset-0 overflow-hidden opacity-20">
//             <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-emerald-400 blur-3xl"
//                  style={{ transform: `translateY(${scrollY * 0.15}px)` }}></div>
//             <div className="absolute top-1/2 -left-32 w-64 h-64 rounded-full bg-cyan-500 blur-3xl"
//                  style={{ transform: `translateY(${-scrollY * 0.2}px)` }}></div>
//             <div className="absolute bottom-20 right-1/3 w-80 h-80 rounded-full bg-teal-400 blur-3xl"
//                  style={{ transform: `translateY(${-scrollY * 0.25}px)` }}></div>
//           </div>
//         </div>
        
//         <div className="relative z-10 p-6">
//           <div className="max-w-7xl mx-auto">
//             <header className="mb-8 pt-6 text-white">
//               <div className="mb-4 inline-flex items-center px-4 py-2 rounded-full bg-cyan-500/20 text-cyan-300 text-sm font-medium tracking-wider">
//                 <Package size={16} className="mr-2" />
//                 DRIVER CONTROL CENTER
//               </div>
//               <h1 className="text-4xl lg:text-5xl font-bold mb-2">
//                 <span className="text-zinc-50 block">Deliveries</span>
//                 <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
//                   Route Management
//                 </span>
//               </h1>
//               <p className="text-zinc-300 mt-2">Manage your assigned deliveries and track your progress</p>
//             </header>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-16">
//               <StatCard 
//                 title="Completed" 
//                 value={completedDeliveries}
//                 change="+2 today" 
//                 isPositive={true} 
//                 icon={<Package size={24} className="text-white" />} 
//                 delay={0} 
//                 animate={animateStats}
//                 color="emerald" 
//               />
//               <StatCard 
//                 title="In Transit" 
//                 value={inTransitDeliveries}
//                 change="Next stop in 15min" 
//                 isPositive={true} 
//                 icon={<TrendingUp size={24} className="text-white" />} 
//                 delay={100} 
//                 animate={animateStats}
//                 color="teal" 
//               />
//               <StatCard 
//                 title="Scheduled" 
//                 value={scheduledDeliveries}
//                 change="Today's remaining" 
//                 isPositive={true} 
//                 icon={<MapPin size={24} className="text-white" />} 
//                 delay={200} 
//                 animate={animateStats}
//                 color="cyan" 
//               />
//             </div>

//             <div className="bg-white shadow-lg rounded-2xl p-6 border border-zinc-100 mb-8">
//               <div className="flex justify-between items-center mb-6">
//                 <div>
//                   <h2 className="text-xl font-semibold text-zinc-800">Active Deliveries</h2>
//                   <p className="text-zinc-500">Manage your delivery routes</p>
//                 </div>
//                 <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
//                   <ChartBar size={20} />
//                 </div>
//               </div>
              
//               {loading ? (
//                 <div className="flex items-center justify-center h-64">
//                   <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
//                 </div>
//               ) : error ? (
//                 <div className="flex items-center justify-center h-64 text-red-500">
//                   Error loading deliveries: {error}
//                 </div>
//               ) : Array.isArray(deliveries) && deliveries.length > 0 ? (
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full">
//                     <thead>
//                       <tr className="border-b-2 border-zinc-200">
//                         <th className="py-3 px-4 text-left text-zinc-500 font-semibold text-sm uppercase">Order ID</th>
//                         <th className="py-3 px-4 text-left text-zinc-500 font-semibold text-sm uppercase">Status</th>
//                         <th className="py-3 px-4 text-left text-zinc-500 font-semibold text-sm uppercase">Location</th>
//                         <th className="py-3 px-4 text-left text-zinc-500 font-semibold text-sm uppercase">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {deliveries.map((delivery, index) => (
//                         <tr
//                           key={delivery._id}
//                           className={`border-b border-zinc-100 hover:bg-zinc-50 cursor-pointer transition-colors duration-150 ${
//                             animateStats ? "opacity-100" : "opacity-0"
//                           }`}
//                           style={{ transitionDelay: `${300 + index * 50}ms` }}
//                         >
//                           <td className="py-4 px-4 font-medium text-zinc-800">{delivery.order?._id || "N/A"}</td>
//                           <td className="py-4 px-4">
//                             <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold
//                               ${delivery.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 
//                               delivery.status === 'In Transit' ? 'bg-cyan-100 text-cyan-700' : 
//                               delivery.status === 'Scheduled' ? 'bg-amber-100 text-amber-700' : 
//                               'bg-red-100 text-red-700'}`}>
//                               {delivery.status}
//                             </span>
//                           </td>
//                           <td className="py-4 px-4 text-zinc-600">{delivery.location || "Unknown"}</td>
//                           <td className="py-4 px-4">
//                             <button
//                               onClick={() => {
//                                 setSelectedDelivery(delivery);
//                                 setShowMap(true);
//                               }}
//                               className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:shadow-lg hover:from-emerald-600 hover:to-teal-700 transition-all text-sm font-medium flex items-center"
//                             >
//                               <MapPin size={16} className="mr-2" />
//                               View Map
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <div className="flex items-center justify-center h-64 text-zinc-500">
//                   No deliveries found. Check back later for new assignments.
//                 </div>
//               )}
//             </div>

//             <div className="bg-white shadow-lg rounded-2xl p-6 border border-zinc-100 mb-8">
//               <h2 className="text-xl font-semibold text-zinc-800 mb-4">Quick Actions</h2>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {[
//                   { 
//                     label: "Today's Route", 
//                     icon: <MapPin size={20} />,
//                     action: () => dispatch(fetchDriverData())
//                   },
//                   { 
//                     label: "Delivery History", 
//                     icon: <Package size={20} />,
//                     action: () => console.log("View history")
//                   },
//                   { 
//                     label: "Update Status", 
//                     icon: <TrendingUp size={20} />,
//                     action: () => {
//                       if (selectedDelivery) {
//                         // Example update - in a real app, you'd have a modal or form
//                         handleUpdateStatus(
//                           selectedDelivery._id,
//                           'In Transit',
//                           { lat: 37.7749, lng: -122.4194 },
//                           null
//                         );
//                       }
//                     }
//                   },
//                   { 
//                     label: "Support", 
//                     icon: <ChartBar size={20} />,
//                     action: () => console.log("Open support")
//                   },
//                 ].map((action, index) => (
//                   <button 
//                     key={index}
//                     className="flex items-center justify-center gap-2 p-4 bg-zinc-50 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 rounded-xl border border-zinc-200 transition-all hover:shadow-md group"
//                     onClick={action.action}
//                   >
//                     <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white transform transition-all duration-300 group-hover:rotate-6">
//                       {action.icon}
//                     </div>
//                     <span className="font-medium text-zinc-700">{action.label}</span>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Map Popup */}
//         {showMap && selectedDelivery && selectedDelivery.location && (
//           <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-xl shadow-xl relative w-11/12 max-w-5xl h-3/4">
//               <div className="absolute top-4 right-4">
//                 <button
//                   className="bg-zinc-200 hover:bg-zinc-300 text-zinc-800 p-2 rounded-full transition-colors"
//                   onClick={() => setShowMap(false)}
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <line x1="18" y1="6" x2="6" y2="18"></line>
//                     <line x1="6" y1="6" x2="18" y2="18"></line>
//                   </svg>
//                 </button>
//               </div>

//               <div className="mb-6">
//                 <h3 className="text-xl font-semibold text-zinc-800">Delivery Location</h3>
//                 <p className="text-zinc-500">Order ID: {selectedDelivery.order?._id || "N/A"}</p>
//               </div>

//               <div className="h-5/6 rounded-lg overflow-hidden">
//                 <MapContainer
//                   center={[selectedDelivery.location.lat, selectedDelivery.location.lng]}
//                   zoom={13}
//                   scrollWheelZoom={false}
//                   className="w-full h-full rounded-lg"
//                 >
//                   <TileLayer
//                     attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
//                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                   />
//                   <Marker
//                     position={[selectedDelivery.location.lat, selectedDelivery.location.lng]}
//                     icon={customIcon}
//                   >
//                     <MapPopup>
//                       <div className="text-zinc-800">
//                         <strong>Delivery Location</strong>
//                         <p>Order: {selectedDelivery.order?._id || "N/A"}</p>
//                         <p>Status: {selectedDelivery.status}</p>
//                       </div>
//                     </MapPopup>
//                   </Marker>
//                 </MapContainer>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// const StatCard = ({ title, value, change, isPositive, icon, delay, animate, color }) => {
//   const [isHovered, setIsHovered] = useState(false);

//   const getGradient = () => {
//     switch(color) {
//       case 'emerald': return 'from-emerald-500 to-emerald-600';
//       case 'teal': return 'from-teal-500 to-teal-600';
//       case 'cyan': return 'from-cyan-500 to-cyan-600';
//       default: return 'from-emerald-500 to-emerald-600';
//     }
//   };

//   return (
//     <div 
//       className={`p-6 bg-white shadow-lg rounded-2xl hover:shadow-xl transition-all duration-500 transform ${
//         animate ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
//       } ${isHovered ? "-translate-y-1" : ""} border border-zinc-100 relative overflow-hidden`}
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
//         <div className="text-zinc-500 text-sm font-medium">
//           <span>{change}</span>
//         </div>
//       </div>
//       <h2 className="text-lg font-medium text-zinc-600">{title}</h2>
//       <p className="text-3xl font-bold text-zinc-800 mt-1">{value}</p>
//       <div className={`mt-4 h-1 w-16 bg-gradient-to-r ${getGradient()} rounded-full transition-all duration-500 ${
//         isHovered ? "w-3/4" : ""
//       }`}></div>
//     </div>
//   );
// };

// export default DriverDashboard;
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDriverData } from "../redux/driver/driverSlice";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line
} from "recharts";
import {
  ArrowUpRight, ArrowDownRight, Truck, MapPin, Fuel, Clock, 
  AlertCircle, Calendar, ChartBar
} from "lucide-react";

const DriverDashboard = () => {
  const dispatch = useDispatch();
  const { 
    deliveries = [], 
    totalDistance = 0, 
    fuelConsumption = 0, 
    onTimeRate = 0, 
    loading, 
    error,
    deliveryPerformance = [],
    routeEfficiency = []
  } = useSelector((state) => state.driver || {});

  const [animateStats, setAnimateStats] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    dispatch(fetchDriverData());
    setTimeout(() => setAnimateStats(true), 100);
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
      <Navbar />
      <main className="flex-1 overflow-y-auto relative">
        {/* Background with depth layers */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Background gradient with blue/teal theme for drivers */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-blue-950 via-indigo-900 to-teal-900 h-64"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          ></div>
          
          {/* Geometric shapes with blue/teal color scheme */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-blue-400 blur-3xl"
                 style={{ transform: `translateY(${scrollY * 0.15}px)` }}></div>
            <div className="absolute top-1/2 -left-32 w-64 h-64 rounded-full bg-indigo-500 blur-3xl"
                 style={{ transform: `translateY(${-scrollY * 0.2}px)` }}></div>
            <div className="absolute bottom-20 right-1/3 w-80 h-80 rounded-full bg-teal-400 blur-3xl"
                 style={{ transform: `translateY(${-scrollY * 0.25}px)` }}></div>
          </div>
          
          {/* Adding background grid pattern */}
          <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800/20 [mask-image:linear-gradient(to_bottom,transparent,50%,white)]"></div>
        </div>
        
        <div className="relative z-10 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header with updated design */}
            <header className="mb-8 pt-6 text-white">
              <div className="mb-4 inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 text-blue-200 text-sm font-medium tracking-wider">
                <Truck size={16} className="mr-2" />
                DRIVER PORTAL
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-2">
                <span className="text-zinc-50 block">Driver Dashboard</span>
                <span className="bg-gradient-to-r from-blue-300 via-indigo-200 to-teal-300 bg-clip-text text-transparent">
                  Performance & Deliveries
                </span>
              </h1>
              <p className="text-zinc-300 mt-2">Welcome back! Here's an overview of your delivery performance and statistics</p>
            </header>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
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
                    title="Total Deliveries" 
                    value={deliveries.length} 
                    change="+8.3%" 
                    isPositive={true} 
                    icon={<Truck size={24} className="text-white" />} 
                    delay={0} 
                    animate={animateStats}
                    color="blue" 
                  />
                  <StatCard 
                    title="Total Distance" 
                    value={`${totalDistance.toLocaleString()} km`} 
                    change="+12.7%" 
                    isPositive={true} 
                    icon={<MapPin size={24} className="text-white" />} 
                    delay={100} 
                    animate={animateStats}
                    color="teal" 
                  />
                  <StatCard 
                    title="Fuel Consumption" 
                    value={`${fuelConsumption} L`} 
                    change="-4.2%" 
                    isPositive={true} 
                    icon={<Fuel size={24} className="text-white" />} 
                    delay={200} 
                    animate={animateStats}
                    color="indigo" 
                  />
                  <StatCard 
                    title="On-Time Rate" 
                    value={`${onTimeRate}%`} 
                    change="+2.5%" 
                    isPositive={true} 
                    icon={<Clock size={24} className="text-white" />} 
                    delay={300} 
                    animate={animateStats}
                    color="blue" 
                  />
                </div>

                {/* Chart cards updated with glassy design */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  <ChartCard 
                    title="Delivery Performance" 
                    subtitle="Deliveries completed per day" 
                    chartType="bar" 
                    data={Array.isArray(deliveryPerformance) && deliveryPerformance.length > 0 ? deliveryPerformance : [{ day: "N/A", deliveries: 0 }]} 
                    dataKey="deliveries"
                    loading={loading}
                    className="lg:col-span-2" 
                  />
                  <ChartCard 
                    title="Route Efficiency" 
                    subtitle="Distance vs. deliveries ratio" 
                    chartType="line" 
                    data={Array.isArray(routeEfficiency) && routeEfficiency.length > 0 ? routeEfficiency : [{ day: "N/A", efficiency: 0 }]} 
                    dataKey="efficiency"
                    loading={loading} 
                  />
                </div>

                {/* Today's Deliveries card updated with glassy design */}
                <div className="bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg p-6 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Today's Deliveries</h2>
                      <p className="text-slate-500 dark:text-slate-400">Scheduled routes and completed drops</p>
                    </div>
                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white transform transition-all duration-300 hover:rotate-6 hover:scale-110">
                      <Calendar size={20} />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    {deliveries.length === 0 ? (
                      <div className="py-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-200/40 dark:bg-slate-700/40 mb-4">
                          <Truck size={24} className="text-slate-400 dark:text-slate-300" />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400">No deliveries assigned yet</p>
                      </div>
                    ) : (
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b border-slate-200/50 dark:border-slate-700/50">
                            <th className="py-3 px-4 text-left text-slate-600 dark:text-slate-300 font-medium text-sm">
                              Order ID
                            </th>
                            <th className="py-3 px-4 text-left text-slate-600 dark:text-slate-300 font-medium text-sm">
                              Status
                            </th>
                            <th className="py-3 px-4 text-left text-slate-600 dark:text-slate-300 font-medium text-sm">
                              Location
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {deliveries.map((delivery) => (
                            <tr
                              key={delivery._id}
                              className="border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-100/30 dark:hover:bg-slate-800/30 cursor-pointer transition-colors duration-150"
                              onClick={() => setSelectedDelivery(delivery)}
                            >
                              <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-200">{delivery.order?._id || "N/A"}</td>
                              <td className="py-3 px-4">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                                  ${delivery.status === 'Completed' ? 'bg-green-100/80 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
                                  delivery.status === 'In Transit' ? 'bg-blue-100/80 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 
                                  delivery.status === 'Scheduled' ? 'bg-indigo-100/80 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' : 
                                  'bg-red-100/80 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}
                                >
                                  {delivery.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{delivery.location || "Unknown"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                {/* Quick Actions card */}
                <div className="bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg p-6 mb-8">
                  <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Start Route", icon: <Truck size={20} /> },
                      { label: "Fuel Report", icon: <Fuel size={20} /> },
                      { label: "Delivery Map", icon: <MapPin size={20} /> },
                      { label: "Schedule", icon: <Calendar size={20} /> },
                    ].map((action, index) => (
                      <button 
                        key={index}
                        className="flex items-center justify-center gap-2 p-4 bg-gradient-to-br from-white/60 to-white/30 dark:from-slate-800/60 dark:to-slate-800/30 hover:from-blue-50/60 hover:to-blue-50/30 dark:hover:from-slate-700/60 dark:hover:to-slate-700/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-300/50 dark:hover:border-blue-700/50 transition-all hover:shadow-md group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white transform transition-all duration-300 group-hover:rotate-6">
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
      case 'blue': return 'from-blue-500 to-blue-600';
      case 'teal': return 'from-teal-500 to-teal-600';
      case 'indigo': return 'from-indigo-500 to-indigo-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  return (
    <div 
      className={`p-6 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform ${
        animate ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } ${isHovered ? "-translate-y-1" : ""} border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-300/50 dark:hover:border-blue-700/50 relative overflow-hidden`}
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

const ChartCard = ({ title, subtitle, chartType, data, dataKey, loading, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`p-6 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl rounded-2xl hover:shadow-xl transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-300/50 dark:hover:border-blue-700/50 shadow-lg ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white">{title}</h2>
          <p className="text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>
        <div className={`p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white transform transition-all duration-500 ${isHovered ? "rotate-6 scale-110" : ""}`}>
          <ChartBar size={20} />
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-slate-500 dark:text-slate-400">No data available</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          {chartType === "bar" ? (
            <BarChart data={data}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  borderRadius: '0.5rem',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <rect key={`cell-${index}`} fill={`url(#barGradient-${index})`} />
                ))}
              </Bar>
              <defs>
                {data.map((entry, index) => (
                  <linearGradient key={`gradient-${index}`} id={`barGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.8}/>
                  </linearGradient>
                ))}
              </defs>
            </BarChart>
          ) : (
            <LineChart data={data}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  borderRadius: '0.5rem',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <defs>
                <linearGradient id="colorEfficiency" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#0EA5E9" stopOpacity={1}/>
                </linearGradient>
              </defs>
              <Line 
                type="monotone" 
                dataKey={dataKey} 
                stroke="url(#colorEfficiency)" 
                strokeWidth={3} 
                dot={{ r: 6, strokeWidth: 3, fill: "white", stroke: "#3B82F6" }} 
                activeDot={{ r: 8, strokeWidth: 3, fill: "white", stroke: "#3B82F6" }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default DriverDashboard;