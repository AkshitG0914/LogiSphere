import { useState } from "react";
import { useDispatch } from "react-redux";
import { EditProduct } from "../redux/inventory/inventorySlice";
import { X, Package, IndianRupee, Tag, BarChart2, Archive, AlertCircle } from "lucide-react";

const EditProductModal = ({ product, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: product?.name || "",
    category: product?.category || "",
    stock: product?.stock || 0,
    price: product?.price || 0,
    description: product?.description || "",
    sku: product?.sku || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formTouched, setFormTouched] = useState({});

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

  const getInputStateStyles = (fieldName) => {
    if (!formTouched[fieldName]) return "border-gray-300 dark:border-gray-600 focus:border-violet-500 focus:ring-violet-500";
    return formErrors[fieldName] 
      ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
      : "border-green-500 focus:border-green-500 focus:ring-green-500";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product || !product._id) {
      console.error("Error: Product ID is missing");
      return;
    }

    // Mark all fields as touched for validation
    const touchedFields = {
      name: true,
      category: true,
      stock: true,
      price: true
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

    const updatedProductData = {
      name: formData.name || product.name,
      price: formData.price || product.price,
      stock: formData.stock || product.stock,
      category: formData.category || product.category,
      description: formData.description || product.description,
    };

    try {
      console.log("🔄 Updating Product:", updatedProductData);
      await dispatch(EditProduct({ id: product._id, updatedData: updatedProductData }));
      console.log("✅ Product Updated Successfully");
      onClose(); // Close the modal after update
    } catch (error) {
      console.error("❌ Error updating product:", error.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800/75 backdrop-blur-sm flex justify-center items-center z-50">
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out scale-100 p-0 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with violet gradient */}
        <div className="bg-gradient-to-r from-violet-600 to-violet-500 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Package size={18} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Edit Product</h2>
            </div>
            <button 
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/10 p-1"
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
                  className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border rounded-lg focus:ring-2 focus:outline-none transition-all ${getInputStateStyles("name")}`}
                  value={formData.name}
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
            
            {/* SKU & Category - 2 column layout */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">SKU</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag size={18} className="text-violet-500 rotate-90" />
                  </div>
                  <input 
                    type="text" 
                    name="sku" 
                    placeholder="SKU" 
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
                    value={formData.sku}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
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
                <input 
                  type="text" 
                  name="category" 
                  placeholder="Category" 
                  className={`w-full p-3 bg-white dark:bg-gray-700 border rounded-lg focus:ring-2 focus:outline-none transition-all ${getInputStateStyles("category")}`}
                  value={formData.category}
                  onChange={handleChange} 
                  required 
                />
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
                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border rounded-lg focus:ring-2 focus:outline-none transition-all ${getInputStateStyles("stock")}`}
                    value={formData.stock}
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
                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border rounded-lg focus:ring-2 focus:outline-none transition-all ${getInputStateStyles("price")}`}
                    value={formData.price}
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Description (Optional)
              </label>
              <textarea
                name="description"
                rows="3"
                placeholder="Product description"
                className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
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
                Update Product
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

export default EditProductModal;