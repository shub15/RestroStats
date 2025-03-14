import React, { useState } from "react";
import { useTheme } from "./ThemeProvider";

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
  const { darkTheme, toggleTheme } = useTheme();

  const handleAutoFill = () => {
    const now = new Date();
    setDate(now.toISOString().split("T")[0]);
    setTime(now.toTimeString().slice(0, 5));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Bill generated successfully!");
  };

  return (
    <main className={`min-h-screen py-10 px-4 ${darkTheme ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-600 dark:bg-blue-800 text-white py-6 px-6">
          <h1 className="text-3xl font-bold text-center">Generate New Bill</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Customer Details Section */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Customer Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Time</label>
                <input 
                  type="time" 
                  value={time} 
                  onChange={(e) => setTime(e.target.value)} 
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer Name</label>
                <input 
                  type="text" 
                  placeholder="Enter customer name" 
                  value={customerName} 
                  onChange={(e) => setCustomerName(e.target.value)} 
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Table Number</label>
                <input 
                  type="number" 
                  placeholder="Enter table number" 
                  value={tableNumber} 
                  onChange={(e) => setTableNumber(e.target.value)} 
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600" 
                  required 
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={autoFill} 
                  onChange={handleAutoFill} 
                  className="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800" 
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Auto-Fill Date & Time</span>
              </label>
            </div>
          </div>

          {/* Add Items Section */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Add Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Item Description</label>
                <input 
                  type="text" 
                  placeholder="Enter item description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
                <input 
                  type="number" 
                  placeholder="Enter quantity" 
                  value={quantity} 
                  onChange={(e) => setQuantity(e.target.value)} 
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unit Price</label>
                <input 
                  type="number" 
                  placeholder="Enter unit price" 
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)} 
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600" 
                />
              </div>
            </div>
            <button 
              type="button" 
              onClick={addItem} 
              className="mt-4 px-4 py-2 border border-green-600 text-white rounded-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              Add Item
            </button>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-center">Quantity</th>
                  <th className="p-3 text-center">Unit Price</th>
                  <th className="p-3 text-center">Total</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr className="border-t border-gray-200 dark:border-gray-700">
                    <td colSpan="5" className="p-4 text-center text-gray-500 dark:text-gray-400">
                      No items added yet. Add items to generate your bill.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-900 dark:hover:bg-gray-750">
                      <td className="p-3">{item.description}</td>
                      <td className="p-3 text-center">{item.quantity}</td>
                      <td className="p-3 text-center">&#8377;{item.price.toFixed(2)}</td>
                      <td className="p-3 text-center">&#8377;{item.total.toFixed(2)}</td>
                      <td className="p-3 text-center">
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 focus:outline-none"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr className="bg-gray-200 dark:bg-gray-700 font-semibold">
                  <td colSpan="3" className="p-3 text-right">Grand Total</td>
                  <td className="p-3 text-center">&#8377;{grandTotal.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button 
              type="button" 
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              onClick={() => window.print()}
            >
              Print Bill
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Generate Bill
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}