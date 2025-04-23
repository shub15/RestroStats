import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RestaurantDashboard() {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  const navigate = useNavigate();

  // Stats for demo purposes
  const stats = {
    totalOrders: 128,
    pendingOrders: 5,
    completedOrders: 123,
    totalRevenue: 3450,
    popularItems: [
      { name: "Margherita Pizza", orders: 42 },
      { name: "Chicken Tikka", orders: 35 },
      { name: "Caesar Salad", orders: 27 },
    ],
    recentOrders: [
      { id: "#ORD-5421", customer: "John Doe", items: 3, total: "$38.50", status: "Delivered" },
      { id: "#ORD-5420", customer: "Emily Chen", items: 2, total: "$24.99", status: "Preparing" },
      { id: "#ORD-5419", customer: "Michael Smith", items: 4, total: "$52.75", status: "Pending" },
    ]
  };

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem("restaurantToken");

    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch restaurant data
    // In your RestaurantDashboard component
    const fetchRestaurantData = async () => {
      try {
        // Check if token exists
        const token = localStorage.getItem("restaurantToken");

        if (!token) {
          console.error("No token found in localStorage");
          navigate("/login");
          return;
        }

        console.log("Using token:", token); // Debug log

        const response = await fetch("http://localhost:5000/restaurant/profile", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        // Log the response for debugging
        console.log("Response status:", response.status);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("Error response:", errorData);
          throw new Error(errorData.msg || `Failed with status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Restaurant data received:", data);
        setRestaurant(data);
      } catch (err) {
        console.error("Error in fetchRestaurantData:", err);
        setError(err.message || "Could not load restaurant data");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("restaurantToken");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Loading dashboard...</div>
      </div>
    );
  }

  // For demo purposes, create a mock restaurant if none is loaded
  const restaurantData = restaurant || {
    id: 1,
    name: "Bella Italia",
    email: "info@bellaitalia.com",
    address: "123 Main St, Foodville",
    phone: "(123) 456-7890",
    categories: ["Italian", "Pizza", "Pasta"],
    openingHours: "11:00 AM - 10:00 PM"
  };

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Orders</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.totalOrders}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending Orders</h3>
                <p className="text-3xl font-bold text-yellow-500">{stats.pendingOrders}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Revenue</h3>
                <p className="text-3xl font-bold text-green-600">${stats.totalRevenue}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Popular Items</h3>
                <ul className="space-y-3">
                  {stats.popularItems.map((item, index) => (
                    <li key={index} className="flex justify-between items-center border-b pb-2">
                      <span className="font-medium">{item.name}</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">{item.orders} orders</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Orders</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Order ID</th>
                        <th className="text-left py-2">Customer</th>
                        <th className="text-left py-2">Total</th>
                        <th className="text-left py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders.map((order, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2">{order.id}</td>
                          <td className="py-2">{order.customer}</td>
                          <td className="py-2">{order.total}</td>
                          <td className="py-2">
                            <span className={`px-2 py-1 rounded text-xs ${order.status === "Delivered" ? "bg-green-100 text-green-800" :
                              order.status === "Preparing" ? "bg-yellow-100 text-yellow-800" :
                                "bg-blue-100 text-blue-800"
                              }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      case "menu":
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Menu Management</h2>
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                Add New Item
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="py-3 px-4 text-left">Item Name</th>
                    <th className="py-3 px-4 text-left">Category</th>
                    <th className="py-3 px-4 text-left">Price</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">Margherita Pizza</td>
                    <td className="py-3 px-4">Pizza</td>
                    <td className="py-3 px-4">$12.99</td>
                    <td className="py-3 px-4">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Available</span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                      <button className="text-red-600 hover:text-red-800">Delete</button>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">Chicken Tikka</td>
                    <td className="py-3 px-4">Main Course</td>
                    <td className="py-3 px-4">$15.49</td>
                    <td className="py-3 px-4">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Available</span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                      <button className="text-red-600 hover:text-red-800">Delete</button>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">Caesar Salad</td>
                    <td className="py-3 px-4">Salads</td>
                    <td className="py-3 px-4">$8.99</td>
                    <td className="py-3 px-4">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Low Stock</span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                      <button className="text-red-600 hover:text-red-800">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case "orders":
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Management</h2>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <button className="bg-blue-500 text-white px-4 py-2 rounded">All Orders</button>
              <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded">Pending</button>
              <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded">In Progress</button>
              <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded">Completed</button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="py-3 px-4 text-left">Order ID</th>
                    <th className="py-3 px-4 text-left">Customer</th>
                    <th className="py-3 px-4 text-left">Items</th>
                    <th className="py-3 px-4 text-left">Total</th>
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">#ORD-5421</td>
                    <td className="py-3 px-4">John Doe</td>
                    <td className="py-3 px-4">3 items</td>
                    <td className="py-3 px-4">$38.50</td>
                    <td className="py-3 px-4">Apr 19, 2025</td>
                    <td className="py-3 px-4">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Delivered</span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:text-blue-800">View Details</button>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">#ORD-5420</td>
                    <td className="py-3 px-4">Emily Chen</td>
                    <td className="py-3 px-4">2 items</td>
                    <td className="py-3 px-4">$24.99</td>
                    <td className="py-3 px-4">Apr 19, 2025</td>
                    <td className="py-3 px-4">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Preparing</span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:text-blue-800">View Details</button>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">#ORD-5419</td>
                    <td className="py-3 px-4">Michael Smith</td>
                    <td className="py-3 px-4">4 items</td>
                    <td className="py-3 px-4">$52.75</td>
                    <td className="py-3 px-4">Apr 18, 2025</td>
                    <td className="py-3 px-4">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Pending</span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:text-blue-800">View Details</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Restaurant Settings</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={restaurantData.name}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={restaurantData.email}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={restaurantData.phone}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={restaurantData.address}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Opening Hours</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue={restaurantData.openingHours}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button type="button" className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        );
      default:
        return <div>Select a section from the sidebar</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h1 className="text-xl font-bold">{restaurantData.name}</h1>
          <p className="text-gray-400 text-sm mt-1">Restaurant Dashboard</p>
        </div>
        <nav className="mt-6">
          <button
            onClick={() => setActiveSection("overview")}
            className={`flex items-center py-3 px-4 w-full ${activeSection === "overview" ? "bg-gray-700" : "hover:bg-gray-700"}`}
          >
            <span className="mr-3">📊</span> Overview
          </button>
          <button
            onClick={() => setActiveSection("menu")}
            className={`flex items-center py-3 px-4 w-full ${activeSection === "menu" ? "bg-gray-700" : "hover:bg-gray-700"}`}
          >
            <span className="mr-3">🍔</span> Menu Management
          </button>
          <button
            onClick={() => setActiveSection("orders")}
            className={`flex items-center py-3 px-4 w-full ${activeSection === "orders" ? "bg-gray-700" : "hover:bg-gray-700"}`}
          >
            <span className="mr-3">🛒</span> Order Management
          </button>
          <button
            onClick={() => setActiveSection("settings")}
            className={`flex items-center py-3 px-4 w-full ${activeSection === "settings" ? "bg-gray-700" : "hover:bg-gray-700"}`}
          >
            <span className="mr-3">⚙️</span> Settings
          </button>
        </nav>
        <div className="absolute bottom-0 w-64 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center py-2 px-4 w-full text-left hover:bg-gray-700 text-gray-400 hover:text-white"
          >
            <span className="mr-3">🚪</span> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Header */}
        <header className="bg-white shadow p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {activeSection === "overview" && "Dashboard Overview"}
              {activeSection === "menu" && "Menu Management"}
              {activeSection === "orders" && "Order Management"}
              {activeSection === "settings" && "Restaurant Settings"}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  🔔
                </button>
                <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
              </div>
              <div>
                <span className="font-medium">{restaurantData.name}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6">
          {error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          ) : (
            renderContent()
          )}
        </main>
      </div>
    </div>
  );
}