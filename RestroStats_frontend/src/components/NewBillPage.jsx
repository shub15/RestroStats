import React, { useState, useRef } from "react";
import { useTheme } from "./ThemeProvider";
import "../styles/print-bill.css";

export default function NewBillPage() {
  const [items, setItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [autoFill, setAutoFill] = useState(false);
  const [billNumber, setBillNumber] = useState("");
  const { darkTheme, toggleTheme } = useTheme();
  const printAreaRef = useRef(null);

  const handleAutoFill = () => {
    const now = new Date();
    setDate(now.toISOString().split("T")[0]);
    setTime(now.toTimeString().slice(0, 5));
    setBillNumber(`BILL-${now.getTime().toString().slice(-6)}`); // Generate bill number
    setAutoFill(!autoFill);
  };

  const addItem = () => {
    if (!description || !quantity || !price) {
      alert("Please fill in all item fields correctly");
      return;
    }

    const newItem = {
      id: Date.now(),
      description,
      quantity: parseInt(quantity),
      price: parseFloat(price),
      total: parseInt(quantity) * parseFloat(price),
    };

    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    setGrandTotal(updatedItems.reduce((sum, item) => sum + item.total, 0));
    setDescription("");
    setQuantity("");
    setPrice("");
  };

  const removeItem = (id) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    setGrandTotal(updatedItems.reduce((sum, item) => sum + item.total, 0));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!date || !time || !customerName || items.length === 0) {
      alert("Please fill in all required fields and add at least one item before generating the bill");
      return;
    }
    
    try {
      // Get token from local storage or context
      const token = localStorage.getItem('restaurantToken');
      if (!token) {
        alert("You must be logged in to generate bills");
        return;
      }
      
      // Calculate tax amount
      const taxAmount = calculateTax();
      
      const response = await fetch('http://localhost:5000/generate-bill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          billNumber: billNumber || `BILL-${Date.now().toString().slice(-6)}`,
          date,
          time,
          customerName,
          tableNumber, 
          items,
          grandTotal,
          tax: taxAmount
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert(`Bill generated successfully! Bill Number: ${data.bill_number}`);
        // Optional: Clear form or redirect
        clearForm();
        // or window.location.href = '/bills';
      } else {
        alert(`Error: ${data.error || 'Failed to generate bill'}`);
      }
    } catch (error) {
      console.error("Error generating bill:", error);
      alert("An error occurred while generating the bill. Please try again.");
    }
  };
  
  // Add a helper function to clear the form
  const clearForm = () => {
    setItems([]);
    setGrandTotal(0);
    setCustomerName("");
    setTableNumber("");
    setBillNumber("");
    // Don't clear date and time if autofill is enabled
    if (!autoFill) {
      setDate("");
      setTime("");
    }
  };

  const calculateTax = () => {
    return grandTotal * 0.18; // 18% tax
  };

  const handlePrint = () => {
    if (!date || !time || !customerName || items.length === 0) {
      alert("Please fill in all required fields and add at least one item before printing");
      return;
    }
    window.print();
  };

  return (
    <div className={`min-h-screen p-4 transition-colors duration-300 ${
      darkTheme 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white" 
        : "bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 text-gray-900"
    }`}>
      {/* Modern Form UI - Full width on desktop */}
      <div className="w-full mx-auto">
        {/* Header */}
        {/* <div className={`mb-10 rounded-2xl shadow-xl overflow-hidden ${
          darkTheme ? "bg-gradient-to-r from-blue-900 to-purple-900" : "bg-gradient-to-r from-blue-600 to-purple-600"
        }`}>
          <div className="px-6 py-8 text-white">
            <h1 className="text-4xl font-extrabold tracking-tight text-center">Generate New Bill</h1>
            <p className="text-center mt-2 text-lg opacity-90">Create professional invoices for your customers</p>
          </div>
        </div> */}
        
        <form onSubmit={handleSubmit} className={`overflow-hidden space-y-8 mb-20`}>
          {/* Two-column layout for desktop */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Customer Details */}
            <div className={`p-6 rounded-xl flex-1 ${
              darkTheme ? "bg-gray-700/50" : "bg-gray-50"
            }`}>
              <div className="flex items-center gap-2 mb-6">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h2 className="text-xl font-semibold">Customer Details</h2>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium opacity-90">Date</label>
                    <input 
                      type="date" 
                      value={date} 
                      onChange={(e) => setDate(e.target.value)} 
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                        darkTheme 
                          ? "bg-gray-800 border-gray-600 text-white focus:border-blue-500" 
                          : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                      } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium opacity-90">Time</label>
                    <input 
                      type="time" 
                      value={time} 
                      onChange={(e) => setTime(e.target.value)} 
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                        darkTheme 
                          ? "bg-gray-800 border-gray-600 text-white focus:border-blue-500" 
                          : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                      } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                      required 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium opacity-90">Bill Number</label>
                  <input 
                    type="text" 
                    placeholder="Auto-generated with auto-fill" 
                    value={billNumber} 
                    onChange={(e) => setBillNumber(e.target.value)} 
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                      darkTheme 
                        ? "bg-gray-800 border-gray-600 text-white focus:border-blue-500" 
                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium opacity-90">Customer Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter customer name" 
                    value={customerName} 
                    onChange={(e) => setCustomerName(e.target.value)} 
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                      darkTheme 
                        ? "bg-gray-800 border-gray-600 text-white focus:border-blue-500" 
                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium opacity-90">Table Number</label>
                  <input 
                    type="number" 
                    placeholder="Enter table number" 
                    value={tableNumber} 
                    onChange={(e) => setTableNumber(e.target.value)} 
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                      darkTheme 
                        ? "bg-gray-800 border-gray-600 text-white focus:border-blue-500" 
                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                    required 
                  />
                </div>
                
                <div className="mt-6">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={autoFill} 
                      onChange={handleAutoFill} 
                      className={`rounded text-blue-600 focus:ring-blue-500 w-5 h-5 ${
                        darkTheme ? "bg-gray-800" : "bg-white"
                      }`}
                    />
                    <span className="text-sm opacity-90">Auto-Fill Date, Time & Generate Bill Number</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column - Add Items */}
            <div className={`p-6 rounded-xl flex-1 ${
              darkTheme ? "bg-gray-700/50" : "bg-gray-50"
            }`}>
              <div className="flex items-center gap-2 mb-6">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h2 className="text-xl font-semibold">Add Items</h2>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium opacity-90">Item Description</label>
                  <input 
                    type="text" 
                    placeholder="Enter item description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                      darkTheme 
                        ? "bg-gray-800 border-gray-600 text-white focus:border-blue-500" 
                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium opacity-90">Quantity</label>
                    <input 
                      type="number" 
                      placeholder="Enter quantity" 
                      value={quantity} 
                      onChange={(e) => setQuantity(e.target.value)} 
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                        darkTheme 
                          ? "bg-gray-800 border-gray-600 text-white focus:border-blue-500" 
                          : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                      } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium opacity-90">Unit Price</label>
                    <input 
                      type="number" 
                      placeholder="Enter unit price" 
                      value={price} 
                      onChange={(e) => setPrice(e.target.value)} 
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                        darkTheme 
                          ? "bg-gray-800 border-gray-600 text-white focus:border-blue-500" 
                          : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                      } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                    />
                  </div>
                </div>
                
                <button 
                  type="button" 
                  onClick={addItem} 
                  className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg font-medium"
                >
                  Add Item
                </button>
                
                {/* Show a small summary on desktop */}
                <div className={`mt-6 p-4 rounded-lg ${darkTheme ? "bg-gray-800/70" : "bg-white"}`}>
                  <h3 className="font-medium mb-2">Current Bill Summary</h3>
                  <div className="flex justify-between text-sm opacity-90">
                    <span>Items:</span>
                    <span>{items.length}</span>
                  </div>
                  <div className="flex justify-between text-sm opacity-90">
                    <span>Subtotal:</span>
                    <span>₹{grandTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm opacity-90">
                    <span>Tax (18%):</span>
                    <span>₹{calculateTax().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium mt-1 text-blue-600 dark:text-blue-400">
                    <span>Total:</span>
                    <span>₹{(grandTotal + calculateTax()).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table - Full width */}
          <div className="overflow-hidden rounded-xl shadow-lg">
            <table className="w-full">
              <thead>
                <tr className={`${darkTheme ? "bg-gray-700" : "bg-gray-200"}`}>
                  <th className="p-4 text-left font-semibold">Description</th>
                  <th className="p-4 text-center font-semibold">Quantity</th>
                  <th className="p-4 text-center font-semibold">Unit Price</th>
                  <th className="p-4 text-center font-semibold">Total</th>
                  <th className="p-4 text-center font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr className={`${darkTheme ? "bg-gray-800/50" : "bg-white"}`}>
                    <td colSpan="5" className="p-8 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p>No items added yet. Add items to generate your bill.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => (
                    <tr 
                      key={item.id} 
                      className={`
                        ${darkTheme ? "bg-gray-800/50 hover:bg-gray-700/50" : "bg-white hover:bg-gray-50"}
                        transition-colors duration-200
                        ${index !== items.length - 1 ? "border-b border-gray-200/20" : ""}
                      `}
                    >
                      <td className="p-4">{item.description}</td>
                      <td className="p-4 text-center">{item.quantity}</td>
                      <td className="p-4 text-center">₹{item.price.toFixed(2)}</td>
                      <td className="p-4 text-center font-medium">₹{item.total.toFixed(2)}</td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="px-4 py-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-20"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr className={`${darkTheme ? "bg-gray-700/80" : "bg-gray-100"} font-semibold`}>
                  <td colSpan="3" className="p-4 text-right">Subtotal</td>
                  <td className="p-4 text-center">₹{grandTotal.toFixed(2)}</td>
                  <td></td>
                </tr>
                <tr className={`${darkTheme ? "bg-gray-700/90" : "bg-gray-100"} font-semibold`}>
                  <td colSpan="3" className="p-4 text-right">Tax (18%)</td>
                  <td className="p-4 text-center">₹{calculateTax().toFixed(2)}</td>
                  <td></td>
                </tr>
                <tr className={`${darkTheme ? "bg-blue-900/50" : "bg-blue-50"} font-bold text-lg`}>
                  <td colSpan="3" className="p-4 text-right">Grand Total</td>
                  <td className="p-4 text-center text-blue-600 dark:text-blue-400">₹{(grandTotal + calculateTax()).toFixed(2)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-8">
            <button 
              type="button" 
              className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg font-medium"
              onClick={handlePrint}
            >
              Print Bill
            </button>
            <button 
              type="submit" 
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg font-medium"
            >
              Generate Bill
            </button>
          </div>
        </form>
      </div>

      {/* Print Format - Hidden from UI, visible only during printing */}
      <div id="printArea" className="print-only">
        <div className="bill-paper">
          {/* Bill Header */}
          <div className="bill-header">
            <h1>Your Restaurant Name</h1>
            <p>123 Street, City, State - 123456</p>
            <p>Phone: (123) 456-7890</p>
            <p>GST No: 12ABCDE3456F7Z8</p>
          </div>
          
          <div className="bill-divider"></div>
          
          {/* Bill Details */}
          <div className="bill-details">
            <p><strong>Bill No:</strong> {billNumber || 'BILL-123456'}</p>
            <p><strong>Date:</strong> {date}</p>
            <p><strong>Time:</strong> {time}</p>
            <p><strong>Customer:</strong> {customerName}</p>
            {tableNumber && <p><strong>Table No:</strong> {tableNumber}</p>}
          </div>
          
          <div className="bill-divider"></div>
          
          {/* Items */}
          <table className="bill-items">
            <thead>
              <tr>
                <th align="left">Item</th>
                <th align="center">Qty</th>
                <th align="right">Price</th>
                <th align="right">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.description}</td>
                  <td align="center">{item.quantity}</td>
                  <td align="right">₹{item.price.toFixed(2)}</td>
                  <td align="right">₹{item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="bill-divider"></div>
          
          {/* Totals */}
          <div className="bill-totals">
            <div className="bill-total-row">
              <span>Subtotal:</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
            <div className="bill-total-row">
              <span>Tax (18%):</span>
              <span>₹{calculateTax().toFixed(2)}</span>
            </div>
            <div className="bill-total-row grand-total">
              <span>Grand Total:</span>
              <span>₹{(grandTotal + calculateTax()).toFixed(2)}</span>
            </div>
          </div>
          
          <div className="bill-footer">
            <p>Thank you for dining with us!</p>
            <p>Please visit again</p>
          </div>
        </div>
      </div>
    </div>
  );
}