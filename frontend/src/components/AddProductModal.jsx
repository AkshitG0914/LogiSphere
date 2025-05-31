import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { createProduct } from "../redux/inventory/inventorySlice";
import { 
  X, Package, IndianRupee, Tag, BarChart2, 
  Archive, ChevronDown, Check, AlertCircle, 
  FileText, Grid
} from "lucide-react";

const AddProductModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const modalRef = useRef(null);
  const [formData, setFormData] = useState({ 
    name: "", 
    category: "", 
    stock: 0, 
    price: 0,
    description: "",
    sku: "",
    lowStockThreshold: 5,
    status: "Available"
  });
  const [animateForm, setAnimateForm] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formTouched, setFormTouched] = useState({});

  const categories = ["Electronics", "Clothing", "Home", "Grocery", "Other"];

  useEffect(() => {
    setTimeout(() => setAnimateForm(true), 100);
    
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.category-dropdown')) {
        setDropdownOpen(false);
      }
    };
    
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [dropdownOpen, onClose]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue = type === "number" ? parseFloat(value) : value;
    
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
    setFormTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, parsedValue);
  };

  const validateField = (name, value) => {
    const newErrors = { ...formErrors };
    
    switch (name) {
      case "name":
        if (!value || value.trim() === "") newErrors.name = "Product name is required";
        else delete newErrors.name;
        break;
      case "category":
        if (!value) newErrors.category = "Category is required";
        else delete newErrors.category;
        break;
      case "price":
        if (value <= 0) newErrors.price = "Price must be greater than 0";
        else delete newErrors.price;
        break;
      case "stock":
        if (value < 0) newErrors.stock = "Stock cannot be negative";
        else delete newErrors.stock;
        break;
      default:
        break;
    }
    
    setFormErrors(newErrors);
  };

  const selectCategory = (category) => {
    setFormData(prev => ({ ...prev, category }));
    setFormTouched(prev => ({ ...prev, category: true }));
    validateField("category", category);
    setDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched for validation
    const touchedFields = {
      name: true,
      category: true,
      stock: true,
      price: true,
      lowStockThreshold: true
    };
    setFormTouched(touchedFields);
    
    // Validate all required fields
    let hasErrors = false;
    Object.keys(touchedFields).forEach(field => {
      validateField(field, formData[field]);
      if (formErrors[field]) hasErrors = true;
    });
    
    if (hasErrors) return;
    
    setSubmitting(true);
  
    const newProduct = {
      name: formData.name,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      category: formData.category,
      description: formData.description || "",
      sku: formData.sku || "",
      lowStockThreshold: parseInt(formData.lowStockThreshold),
      status: parseInt(formData.stock) > 0 ? "Available" : "Out of Stock"
    };
  
    try {
      await dispatch(createProduct(newProduct));
      onClose();
    } catch (error) {
      console.error("Error adding product:", error.message);
      setSubmitting(false);
    }
  };

  // Helper function for input styling based on validation
  const getInputStateStyles = (fieldName) => {
    if (!formTouched[fieldName]) return "border-gray-300 dark:border-gray-600 focus:border-violet-500 focus:ring-violet-500";
    return formErrors[fieldName] 
      ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
      : "border-green-500 focus:border-green-500 focus:ring-green-500";
  };

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-gray-800/75 flex justify-center items-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 ${
          animateForm ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-violet-500 p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Package size={18} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Add New Product</h2>
            </div>
            <button 
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/10 p-1"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* Product Name */}
            <div>
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                {formTouched.name && formErrors.name && (
                  <span className="text-xs text-red-500 flex items-center">
                    <AlertCircle size={12} className="mr-1" /> {formErrors.name}
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag size={18} className={formTouched.name && formErrors.name ? "text-red-500" : "text-violet-500"} />
                </div>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Enter product name" 
                  className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${getInputStateStyles("name")}`}
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
            
            {/* SKU & Category - 2 column layout */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  SKU (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag size={18} className="text-violet-500 rotate-90" />
                  </div>
                  <input 
                    type="text" 
                    name="sku" 
                    placeholder="Product SKU" 
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:outline-none" 
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="category-dropdown">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  {formTouched.category && formErrors.category && (
                    <span className="text-xs text-red-500 flex items-center">
                      <AlertCircle size={12} className="mr-1" /> Required
                    </span>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Grid size={18} className={formTouched.category && formErrors.category ? "text-red-500" : "text-violet-500"} />
                  </div>
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(!dropdownOpen);
                    }}
                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border rounded-lg cursor-pointer flex justify-between items-center ${getInputStateStyles("category")}`}
                  >
                    <span className={formData.category ? "text-gray-800 dark:text-white" : "text-gray-400 dark:text-gray-400"}>
                      {formData.category || "Select category"}
                    </span>
                    <ChevronDown size={18} className="text-gray-500 dark:text-gray-400" />
                  </div>
                  
                  {dropdownOpen && (
                    <div className="absolute left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {categories.map((category) => (
                        <div 
                          key={category} 
                          className="px-4 py-3 text-gray-800 dark:text-white hover:bg-violet-50 dark:hover:bg-violet-900/20 cursor-pointer flex items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            selectCategory(category);
                          }}
                        >
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                            formData.category === category 
                              ? "border-violet-500 bg-violet-500" 
                              : "border-gray-300 dark:border-gray-500"
                          }`}>
                            {formData.category === category && (
                              <Check size={12} className="text-white" />
                            )}
                          </div>
                          <span className={formData.category === category ? "text-violet-600 dark:text-violet-300 font-medium" : ""}>
                            {category}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Stock & Price - 2 column layout */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Stock Quantity <span className="text-red-500">*</span>
                  </label>
                  {formTouched.stock && formErrors.stock && (
                    <span className="text-xs text-red-500 flex items-center">
                      <AlertCircle size={12} className="mr-1" /> {formErrors.stock}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Archive size={18} className={formTouched.stock && formErrors.stock ? "text-red-500" : "text-violet-500"} />
                  </div>
                  <input 
                    type="number" 
                    name="stock" 
                    placeholder="0" 
                    min="0" 
                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${getInputStateStyles("stock")}`}
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  {formTouched.price && formErrors.price && (
                    <span className="text-xs text-red-500 flex items-center">
                      <AlertCircle size={12} className="mr-1" /> {formErrors.price}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IndianRupee size={18} className={formTouched.price && formErrors.price ? "text-red-500" : "text-violet-500"} />
                  </div>
                  <input 
                    type="number" 
                    name="price" 
                    placeholder="0.00" 
                    min="0" 
                    step="0.01" 
                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${getInputStateStyles("price")}`}
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>
            </div>
            
            {/* Low Stock Threshold */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Low Stock Alert Threshold
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BarChart2 size={18} className="text-violet-500" />
                </div>
                <input 
                  type="number" 
                  name="lowStockThreshold" 
                  placeholder="5" 
                  min="1"
                  defaultValue="5"
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:outline-none" 
                  onChange={handleChange}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                You'll receive alerts when stock falls below this level
              </p>
            </div>
            
            {/* Product Status
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Product Status
              </label>
              <div className="p-3 bg-gray-50 dark:bg-gray-700/40 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center">
                <div className={`h-3 w-3 rounded-full mr-2 ${formData.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-gray-700 dark:text-gray-200">
                  {formData.stock > 0 ? 'Available' : 'Out of Stock'}
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                  Auto-determined by stock level
                </p>
              </div>
            </div> */}
            
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Description (Optional)
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                  <FileText size={18} className="text-violet-500" />
                </div>
                <textarea
                  name="description"
                  rows="3"
                  placeholder="Enter product description..."
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white rounded-lg resize-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:outline-none"
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-8 flex gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              disabled={submitting}
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-lg hover:shadow-lg hover:shadow-violet-500/30 transition-all duration-300 transform hover:-translate-y-1 relative"
            >
              <span className={submitting ? "opacity-0" : "opacity-100"}>
                Add Product
              </span>
              {submitting && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;