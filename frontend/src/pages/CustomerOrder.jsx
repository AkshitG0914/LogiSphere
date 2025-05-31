import { useEffect, useState, cloneElement } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/products/productSlice";
import { placeOrder } from "../redux/orders/orderSlice";
import { ShoppingCart, Package, Plus, Minus, Trash2, CreditCard, DollarSign, CheckCircle, ArrowRight, ShieldCheck, Truck, ChartBar, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Navbar from "../components/Navbar";

const CustomerOrder = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products || {});
  const { orderLoading, recentOrders = [] } = useSelector((state) => state.orders);
  const [cart, setCart] = useState([]);
  const [scrollY, setScrollY] = useState(0);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);
  const [orderStatus, setOrderStatus] = useState('idle'); // 'idle', 'processing', 'shipping', 'delivered'
  const [isProcessing, setIsProcessing] = useState(false);
  const [localProducts, setLocalProducts] = useState([]);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    dispatch(fetchProducts());
    setTimeout(() => setAnimateStats(true), 100);
  }, [dispatch]);

  useEffect(() => {
    if (products) {
      setLocalProducts(products);
    }
  }, [products]);

  const handleAddToCart = (product) => {
    const exists = cart.find((item) => item.product === product._id);
    
    // Check if adding one more would exceed stock
    if (exists) {
      if (exists.quantity >= product.stock) {
        alert(`Sorry, only ${product.stock} items available in stock.`);
        return;
      }
      setCart(cart.map((item) => 
        item.product === product._id ? 
        { ...item, quantity: item.quantity + 1 } : 
        item
      ));
    } else {
      if (product.stock <= 0) {
        alert('Sorry, this item is out of stock.');
        return;
      }
      setCart([...cart, { 
        product: product._id, 
        name: product.name, 
        price: product.price, 
        quantity: 1,
        image: product.image || null,
        maxStock: product.stock // Store max stock with cart item
      }]);
    }
  };

  const handleRemoveFromCart = (productId) => {
    const exists = cart.find((item) => item.product === productId);
    if (exists.quantity === 1) {
      setCart(cart.filter((item) => item.product !== productId));
    } else {
      setCart(cart.map((item) => item.product === productId ? { ...item, quantity: item.quantity - 1 } : item));
    }
  };

  const handleDeleteFromCart = (productId) => {
    setCart(cart.filter((item) => item.product !== productId));
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      setCart([]);
    }
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    // Verify stock levels before placing order
    const stockCheck = cart.every(item => {
      const product = localProducts.find(p => p._id === item.product);
      return product && item.quantity <= product.stock;
    });

    if (!stockCheck) {
      alert("Some items in your cart exceed available stock. Please adjust quantities.");
      return;
    }

    try {
      setIsProcessingOrder(true);
      setIsProcessing(true);
      setOrderStatus('processing');

      const orderData = {
        items: cart.map(item => ({
          product: item.product,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: calculateTotal(),
      };

      await dispatch(placeOrder(orderData)).unwrap();
      
      // Update local product stock
      const updatedProducts = localProducts.map(product => {
        const cartItem = cart.find(item => item.product === product._id);
        if (cartItem) {
          return {
            ...product,
            stock: product.stock - cartItem.quantity
          };
        }
        return product;
      });
      
      setLocalProducts(updatedProducts);

      // Show success state with sequential animations
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOrderStatus('shipping');
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOrderStatus('delivered');
      setOrderSuccess(true);
      setCart([]);
      setOrderStatus('idle');

    } catch (error) {
      console.error("Order failed:", error);
      alert("Failed to place order. Please try again.");
      setOrderStatus('idle');
    } finally {
      setIsProcessingOrder(false);
      setIsProcessing(false);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
      <Navbar />
      <main className="flex-1 overflow-y-auto relative">
        {/* Background with depth layers - matching Dashboard style */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient background */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-violet-950 via-indigo-900 to-purple-900 h-64"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          ></div>
          
          {/* Geometric shapes with color scheme */}
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
            {/* Header with updated design to match Dashboard */}
            <header className="mb-8 pt-6 text-white">
              <div className="mb-4 inline-flex items-center px-4 py-2 rounded-full bg-violet-500/20 text-violet-200 text-sm font-medium tracking-wider">
                <ShoppingCart size={16} className="mr-2" />
                CUSTOMER SHOPPING CENTER
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-2">
                <span className="text-zinc-50 block">Order Management</span>
                <span className="bg-gradient-to-r from-violet-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent">
                  Products & Shopping Cart
                </span>
              </h1>
              <p className="text-zinc-300 mt-2">Browse our products and place your order in just a few clicks</p>
            </header>

            {/* Stat Cards Grid - Matching Dashboard style */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-16">
              <StatCard 
                title="Available Products" 
                value={products?.length || 0} 
                change="+3 new" 
                isPositive={true} 
                icon={<Package size={24} className="text-white" />} 
                delay={0} 
                animate={animateStats}
                color="violet" 
              />
              <StatCard 
                title="Items in Cart" 
                value={getItemsCount()} 
                change={getItemsCount() > 0 ? "+1 item" : "0 items"} 
                isPositive={getItemsCount() > 0} 
                icon={<ShoppingCart size={24} className="text-white" />} 
                delay={100} 
                animate={animateStats}
                color="indigo" 
              />
              <StatCard 
                title="Cart Total" 
                value={`₹${calculateTotal().toLocaleString()}`} 
                change={calculateTotal() > 0 ? "+₹" + calculateTotal().toLocaleString() : "₹0"} 
                isPositive={calculateTotal() > 0} 
                icon={<DollarSign size={24} className="text-white" />} 
                delay={200} 
                animate={animateStats}
                color="purple" 
              />
            </div>

            {/* Main Content Grid with updated styling */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Products Section */}
              <div className="lg:col-span-2">
                <div className="bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg mb-6">
                  <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 rounded-lg bg-gradient-to-r from-violet-500 to-violet-600">
                          <Package className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Available Products</h2>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Select items to add to cart</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <select className="px-3 py-2 bg-white/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-700/50 rounded-lg text-sm backdrop-blur-sm text-slate-700 dark:text-slate-200">
                          <option>All Categories</option>
                          <option>Electronics</option>
                          <option>Apparel</option>
                          <option>Home Goods</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {loading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="w-16 h-16 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {localProducts.map((product) => (
                          <ProductCard 
                            key={product._id} 
                            product={product} 
                            onAddToCart={handleAddToCart}
                            isProcessing={isProcessing} 
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Cart Section - Right Sidebar */}
              <div className="sticky top-6">
                <div className="bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
                  <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 rounded-lg bg-gradient-to-r from-violet-500 to-violet-600">
                          <ShoppingCart className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Your Cart</h2>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{getItemsCount()} items</p>
                        </div>
                      </div>
                      {cart.length > 0 && (
                        <button
                          onClick={handleClearCart}
                          className="px-3 py-1 text-sm bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          Clear Cart
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {orderSuccess ? (
                    <div className="p-8 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 mb-4">
                        <CheckCircle className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
                      </div>
                      <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Order Placed Successfully!</h3>
                      <p className="text-slate-500 dark:text-slate-400 mb-6">Your order has been placed and is being processed</p>
                      <button
                        onClick={() => setOrderSuccess(false)}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white rounded-lg transition-colors shadow-md hover:shadow-xl hover:shadow-violet-500/25"
                      >
                        Place Another Order <ArrowRight className="ml-2 w-4 h-4" />
                      </button>
                    </div>
                  ) : cart.length === 0 ? (
                    <div className="p-12 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-500/20 mb-4">
                        <ShoppingCart className="w-8 h-8 text-violet-500 dark:text-violet-400" />
                      </div>
                      <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Your cart is empty</h3>
                      <p className="text-slate-500 dark:text-slate-400 mb-6">Add products to your cart to proceed</p>
                    </div>
                  ) : (
                    <>
                      <div className="overflow-y-auto" style={{ maxHeight: '900vh' }}>
                        <div className="p-6 space-y-4">
                          {cart.map((item) => (
                            <CartItem 
                              key={item.product} 
                              item={item} 
                              onAdd={() => handleAddToCart({ _id: item.product, name: item.name, price: item.price })} 
                              onRemove={handleRemoveFromCart} 
                              onDelete={handleDeleteFromCart} 
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="p-6 border-t border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-slate-50/80 to-white/40 dark:from-slate-800/80 dark:to-slate-700/40">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
                            <span className="font-semibold text-slate-900 dark:text-white">₹{calculateTotal().toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600 dark:text-slate-400">Shipping</span>
                            <span className="font-medium text-slate-900 dark:text-white">Free</span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                            <span className="font-medium text-slate-900 dark:text-white">Total</span>
                            <span className="text-lg font-bold text-slate-900 dark:text-white">₹{calculateTotal().toLocaleString()}</span>
                          </div>
                          
                          <button
                            onClick={handlePlaceOrder}
                            disabled={isProcessingOrder}
                            className={`w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white rounded-lg transition-all duration-300 ${
                              isProcessingOrder ? 'opacity-80 cursor-not-allowed' : 'shadow-md hover:shadow-xl hover:shadow-violet-500/25'
                            }`}
                          >
                            {isProcessingOrder ? (
                              <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                                {orderStatus === 'processing' && 'Processing Order...'}
                                {orderStatus === 'shipping' && 'Confirming Order...'}
                                {orderStatus === 'delivered' && 'Completing Order...'}
                              </>
                            ) : (
                              <>
                                <CreditCard className="w-5 h-5 mr-2" />
                                Checkout ({getItemsCount()} items)
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// StatCard component - Matches Dashboard's StatCard style
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

// Updated product card component with glassmorphism design
const ProductCard = ({ product, onAddToCart, isProcessing }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-6 hover:border-violet-300/50 dark:hover:border-violet-500/50 transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {product.image ? (
        <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className={`w-full h-full object-cover transition-transform duration-300 ${isHovered ? "scale-105" : ""}`}
          />
        </div>
      ) : (
        <div className="h-48 mb-4 rounded-lg bg-gradient-to-br from-violet-50 to-violet-100/40 dark:from-violet-900/20 dark:to-violet-800/10 flex items-center justify-center">
          <Package className={`w-12 h-12 text-violet-300 dark:text-violet-700 transition-transform duration-300 ${isHovered ? "scale-110" : ""}`} />
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <h3 className={`text-lg font-semibold transition-colors ${isHovered ? "text-violet-600 dark:text-violet-400" : "text-slate-900 dark:text-white"}`}>
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {product.description}
          </p>
          {/* Add stock status display */}
          <div className="mt-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              product.stock === 0 
                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                : product.stock <= 5
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
            }`}>
              {product.stock === 0 
                ? 'Out of Stock' 
                : `${product.stock} in stock`}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              ₹{product.price.toLocaleString()}
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400">/unit</span>
          </div>
          
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0 || isProcessing}
            className={`inline-flex items-center justify-center p-2 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 ${
              isHovered ? "shadow-lg shadow-violet-500/25" : ""
            } ${
              (product.stock === 0 || isProcessing) ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Update CartItem to show stock limit
const CartItem = ({ item, onAdd, onRemove, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div className={`bg-gradient-to-br from-white/60 to-white/30 dark:from-slate-800/60 dark:to-slate-800/30 backdrop-blur-sm rounded-lg border border-slate-200/50 dark:border-slate-700/50 p-4 transition-all duration-300 ${isHovered ? "border-violet-300/50 dark:border-violet-500/50" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-slate-900 dark:text-white truncate">
            {item.name}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            ₹{item.price.toLocaleString()} × {item.quantity}
          </p>
          {/* Add stock limit indicator */}
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {item.quantity}/{item.maxStock} available
          </p>
        </div>
        <p className="font-semibold text-slate-900 dark:text-white">
          ₹{(item.price * item.quantity).toLocaleString()}
        </p>
      </div>
      
      <div className="flex justify-between items-center mt-3">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onRemove(item.product)}
            className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-700 hover:bg-violet-100 dark:hover:bg-violet-900/30 text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center font-medium text-slate-900 dark:text-white">
            {item.quantity}
          </span>
          <button 
            onClick={onAdd}
            disabled={item.quantity >= item.maxStock}
            className={`p-1.5 rounded-md bg-slate-100 dark:bg-slate-700 hover:bg-violet-100 dark:hover:bg-violet-900/30 text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors ${
              item.quantity >= item.maxStock ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <button 
          onClick={() => onDelete(item.product)}
          className="p-1.5 rounded-md hover:bg-rose-100 dark:hover:bg-rose-900/30 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CustomerOrder;