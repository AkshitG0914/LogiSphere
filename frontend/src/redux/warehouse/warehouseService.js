import axios from "axios";

const API_URL = "process.env.REACT_APP_API_URL/api/warehouses"; // ✅ Ensure correct base URL

// Fetch Warehouse Statistics
const fetchWarehouseStats = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(`${API_URL}/stats`, config);
  return response.data;
};

// Export service functions
const warehouseService = { fetchWarehouseStats };

export default warehouseService;
