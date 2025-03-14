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
  const {darkTheme, toggleTheme} = useTheme();

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
    <main className={`min-h-screen p-6 ${darkTheme ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <div className={`max-w-4xl mx-auto bg-white ${darkTheme ? 'dark:bg-gray-800' : 'bg-white'} shadow-lg rounded-lg p-6`}>
        <h1 className="text-3xl font-bold mb-6 text-center">Generate New Bill</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input" required />
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="input" required />
            <input type="text" placeholder="Customer Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="input" required />
            <input type="number" placeholder="Table Number" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} className="input" required />
          </div>
          <label className="flex items-center space-x-2 mt-4">
            <input type="checkbox" checked={autoFill} onChange={handleAutoFill} />
            <span>Auto-Fill Date & Time</span>
          </label>

          <h2 className="text-xl font-semibold mt-6">Add Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <input type="text" placeholder="Item Description" value={description} onChange={(e) => setDescription(e.target.value)} className="input" />
            <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="input" />
            <input type="number" placeholder="Unit Price" value={price} onChange={(e) => setPrice(e.target.value)} className="input" />
          </div>
          <button type="button" onClick={addItem} className="btn mt-3">Add Item</button>

          <table className="w-full mt-6 border-collapse border border-gray-200 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="p-2">Description</th>
                <th className="p-2">Quantity</th>
                <th className="p-2">Unit Price</th>
                <th className="p-2">Total</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-2">{item.description}</td>
                  <td className="p-2">{item.quantity}</td>
                  <td className="p-2">{item.price.toFixed(2)}</td>
                  <td className="p-2">{item.total.toFixed(2)}</td>
                  <td className="p-2 text-red-500 cursor-pointer" onClick={() => removeItem(item.id)}>Remove</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <td colSpan="3" className="p-2 font-semibold">Grand Total</td>
                <td className="p-2 font-semibold">{grandTotal.toFixed(2)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>

          <div className="flex justify-between mt-6">
            <button type="submit" className="btn">Generate Bill</button>
            <button type="button" className="btn bg-blue-500 px-8 py-2" onClick={() => window.print()}>Print Bill</button>
          </div>
        </form>
      </div>
    </main>
  );
}