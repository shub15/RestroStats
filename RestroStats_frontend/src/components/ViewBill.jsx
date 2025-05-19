import React, { useState, useEffect } from "react";
import { useTheme } from "./ThemeProvider";
import { useNavigate } from "react-router-dom";

const baseURL = import.meta.env.VITE_BASE_URL;

export default function ViewBill() {
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const { darkTheme } = useTheme();
  const navigate = useNavigate();

  // Fetch bills on component mount
  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("restaurantToken");
      if (!token) {
        throw new Error("You must be logged in to view bills");
      }

      const response = await fetch(`${baseURL}/bills`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to fetch bills");
      }

      const data = await response.json();
      
      // Add payment status based on created_at date (for demo purposes)
      // In a real app, you would have a status field in your database
      const billsWithStatus = data.map(bill => ({
        ...bill,
        status: new Date(bill.created_at) < new Date(Date.now() - 86400000) ? "paid" : "unpaid"
      }));
      
      setBills(billsWithStatus);
    } catch (error) {
      console.error("Error fetching bills:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const viewBillDetails = async (billId) => {
    try {
      const token = localStorage.getItem("restaurantToken");
      if (!token) {
        throw new Error("You must be logged in to view bill details");
      }

      const response = await fetch(`${baseURL}/bills/${billId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to fetch bill details");
      }

      const billDetails = await response.json();
      setSelectedBill(billDetails);
      setModalOpen(true);
    } catch (error) {
      console.error("Error fetching bill details:", error);
      alert(error.message);
    }
  };

  const deleteBill = async (billId) => {
    if (!window.confirm("Are you sure you want to delete this bill?")) {
      return;
    }

    try {
      const token = localStorage.getItem("restaurantToken");
      if (!token) {
        throw new Error("You must be logged in to delete bills");
      }

      // Note: You would need to implement this endpoint
      const response = await fetch(`${baseURL}/bills/${billId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete bill");
      }

      // Refresh bills list
      fetchBills();
      alert("Bill deleted successfully");
    } catch (error) {
      console.error("Error deleting bill:", error);
      alert(error.message);
    }
  };

  const printBill = (bill) => {
    // Save the bill data to local storage for the print page to access
    localStorage.setItem("printBillData", JSON.stringify(bill));
    // Open a new window with the print layout
    const printWindow = window.open("/printbill", "_blank");
    if (printWindow) {
      printWindow.focus();
    } else {
      alert("Please allow pop-ups to print bills");
    }
  };

  // Filter bills based on search term and status
  const filteredBills = bills.filter((bill) => {
    const matchesSearch =
      bill.bill_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter =
      filterStatus === "all" || bill.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className={`min-h-screen py-10 px-4 md:px-8 lg:px-12 transition-colors duration-300 ${
      darkTheme 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white" 
        : "bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 text-gray-900"
    }`}>
      <div className="w-full mx-auto">
        {/* Header */}
        <div className={`mb-10 rounded-2xl shadow-xl overflow-hidden ${
          darkTheme ? "bg-gradient-to-r from-indigo-900 to-purple-900" : "bg-gradient-to-r from-indigo-600 to-purple-600"
        }`}>
          <div className="px-6 py-8 text-white">
            <h1 className="text-4xl font-extrabold tracking-tight text-center">Manage Bills</h1>
            <p className="text-center mt-2 text-lg opacity-90">View, edit, and manage your restaurant bills</p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className={`p-6 rounded-xl mb-8 ${
          darkTheme ? "bg-gray-800/80 backdrop-blur-lg" : "bg-white/80 backdrop-blur-lg"
        } shadow-lg`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by bill number or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 ${
                  darkTheme 
                    ? "bg-gray-700 border-gray-600 text-white focus:border-indigo-500" 
                    : "bg-white border-gray-300 text-gray-900 focus:border-indigo-500"
                } focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20`}
              />
            </div>
            
            <div className="flex-shrink-0 w-full md:w-auto">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`w-full md:w-48 px-4 py-3 rounded-lg border transition-all duration-200 ${
                  darkTheme 
                    ? "bg-gray-700 border-gray-600 text-white focus:border-indigo-500" 
                    : "bg-white border-gray-300 text-gray-900 focus:border-indigo-500"
                } focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20`}
              >
                <option value="all">All Bills</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>

            <button
              onClick={() => navigate("/newbill")}
              className="flex-shrink-0 w-full md:w-auto px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg font-medium"
            >
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Bill
              </div>
            </button>
          </div>
        </div>

        {/* Bills Table */}
        <div className={`rounded-xl shadow-xl overflow-hidden ${
          darkTheme ? "bg-gray-800/80 backdrop-blur-lg" : "bg-white/80 backdrop-blur-lg"
        }`}>
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <svg className="animate-spin h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="text-red-500 mb-4">{error}</div>
              <button 
                onClick={fetchBills}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Try Again
              </button>
            </div>
          ) : filteredBills.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium">No bills found</h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                {searchTerm || filterStatus !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "Start by creating your first bill"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`${darkTheme ? "bg-gray-700" : "bg-gray-200"}`}>
                    <th className="px-6 py-4 text-left font-semibold">Bill #</th>
                    <th className="px-6 py-4 text-left font-semibold">Date & Time</th>
                    <th className="px-6 py-4 text-left font-semibold">Customer</th>
                    <th className="px-6 py-4 text-left font-semibold">Table</th>
                    <th className="px-6 py-4 text-right font-semibold">Amount</th>
                    {/* <th className="px-6 py-4 text-center font-semibold">Status</th> */}
                    <th className="px-6 py-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredBills.map((bill) => (
                    <tr 
                      key={bill.id} 
                      className={`${
                        darkTheme ? "hover:bg-gray-700/50" : "hover:bg-gray-50"
                      } transition-colors duration-150`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{bill.bill_number}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{bill.timestamp}</td>
                      <td className="px-6 py-4">{bill.customer_name}</td>
                      <td className="px-6 py-4">{bill.table_number || "-"}</td>
                      <td className="px-6 py-4 text-right font-medium">₹{bill.total_amount.toFixed(2)}</td>
                      {/* <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                          ${bill.status === "paid" 
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}
                        >
                          {bill.status === "paid" ? "Paid" : "Unpaid"}
                        </span>
                      </td> */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center space-x-2">
                          <button 
                            onClick={() => viewBillDetails(bill.id)}
                            className={`p-2 rounded-lg transition-colors duration-200 ${
                              darkTheme 
                                ? "hover:bg-gray-600" 
                                : "hover:bg-gray-200"
                            }`}
                            title="View Bill"
                          >
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => printBill(bill)}
                            className={`p-2 rounded-lg transition-colors duration-200 ${
                              darkTheme 
                                ? "hover:bg-gray-600" 
                                : "hover:bg-gray-200"
                            }`}
                            title="Print Bill"
                          >
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => deleteBill(bill.id)}
                            className={`p-2 rounded-lg transition-colors duration-200 ${
                              darkTheme 
                                ? "hover:bg-gray-600" 
                                : "hover:bg-gray-200"
                            }`}
                            title="Delete Bill"
                          >
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
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

      {/* Bill Details Modal */}
      {modalOpen && selectedBill && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 transition-opacity" 
              aria-hidden="true"
              onClick={() => setModalOpen(false)}
            >
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div 
              className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full ${
                darkTheme ? "bg-gray-800" : "bg-white"
              }`}
              role="dialog" 
              aria-modal="true" 
              aria-labelledby="modal-headline"
            >
              <div className={`px-6 pt-5 pb-6 border-b ${darkTheme ? "border-gray-700" : "border-gray-200"}`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium" id="modal-headline">
                    Bill Details
                  </h3>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="rounded-md p-1 inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className={`px-6 py-4 ${darkTheme ? "bg-gray-800" : "bg-white"}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="text-sm font-medium opacity-70">Bill Number</h4>
                    <p className="text-lg font-medium">{selectedBill.bill_number}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium opacity-70">Date & Time</h4>
                    <p>{selectedBill.timestamp}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium opacity-70">Customer Name</h4>
                    <p>{selectedBill.customer_name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium opacity-70">Table Number</h4>
                    <p>{selectedBill.table_number || "-"}</p>
                  </div>
                </div>
                
                <div className={`rounded-lg overflow-hidden border ${darkTheme ? "border-gray-700" : "border-gray-200"}`}>
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className={darkTheme ? "bg-gray-700" : "bg-gray-100"}>
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Item</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Qty</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Price</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${darkTheme ? "divide-gray-700" : "divide-gray-200"}`}>
                      {selectedBill.items && selectedBill.items.map((item, index) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{item.description}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">{item.quantity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">₹{item.unit_price.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">₹{item.total_price.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className={darkTheme ? "bg-gray-800" : "bg-white"}>
                        <td colSpan="3" className="px-6 py-3 text-right font-medium">Subtotal</td>
                        <td className="px-6 py-3 text-right">₹{selectedBill.subtotal.toFixed(2)}</td>
                      </tr>
                      <tr className={darkTheme ? "bg-gray-800" : "bg-white"}>
                        <td colSpan="3" className="px-6 py-3 text-right font-medium">Tax (18%)</td>
                        <td className="px-6 py-3 text-right">₹{selectedBill.tax_amount.toFixed(2)}</td>
                      </tr>
                      <tr className={`font-bold ${darkTheme ? "bg-gray-700" : "bg-gray-100"}`}>
                        <td colSpan="3" className="px-6 py-3 text-right">Grand Total</td>
                        <td className="px-6 py-3 text-right">₹{selectedBill.total_amount.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              
              <div className={`px-6 py-4 flex justify-end space-x-3 ${darkTheme ? "bg-gray-800" : "bg-gray-50"}`}>
                <button
                  type="button"
                  onClick={() => printBill(selectedBill)}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Bill
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className={`inline-flex justify-center py-2 px-4 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    darkTheme 
                      ? "border-gray-600 bg-gray-700 text-white hover:bg-gray-600" 
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}