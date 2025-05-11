import React, { useEffect, useState } from "react";
import "../styles/print-bill.css";

export default function PrintBill() {
  const [bill, setBill] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [billNumber, setBillNumber] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [customerName, setCustomerName] = useState("Guest");
  const [tableNumber, setTableNumber] = useState("");
  const [items, setItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    // Get bill data from localStorage (saved when "Print" was clicked)
    const billData = localStorage.getItem("printBillData");
    
    if (billData) {
      const parsedBill = JSON.parse(billData);
      setBill(parsedBill);
      
      // Set individual bill details
      setBillNumber(parsedBill.billNumber || parsedBill.id || "BILL-123456");
      
      // Format date and time
      const billDate = new Date(parsedBill.date || new Date());
      setDate(billDate.toLocaleDateString());
      setTime(billDate.toLocaleTimeString());
      
      // Set customer and table info
      setCustomerName(parsedBill.customerName || "Guest");
      setTableNumber(parsedBill.tableNumber || parsedBill.table || "");
      
      // Format items with required structure
      if (parsedBill.items && Array.isArray(parsedBill.items)) {
        const formattedItems = parsedBill.items.map((item, index) => ({
          id: item.id || index,
          description: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity
        }));
        
        setItems(formattedItems);
        
        // Calculate grand total
        const total = formattedItems.reduce((sum, item) => sum + item.total, 0);
        setGrandTotal(total);
      }
    }
    
    // Fetch restaurant details from API
    const fetchRestaurantDetails = async () => {
      try {
        const token = localStorage.getItem("restaurantToken");
        if (!token) {
          throw new Error("Authentication required");
        }
        
        const response = await fetch("http://localhost:5000/restaurant/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch restaurant details");
        }
        
        const data = await response.json();
        setRestaurant(data);
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRestaurantDetails();
    
    // Auto-print after loading
    if (billData) {
      const timer = setTimeout(() => {
        window.print();
      }, 1000);
      
      // Clear timeout on unmount
      return () => clearTimeout(timer);
    }
  }, []);

  // Calculate tax (18%)
  const calculateTax = () => {
    return grandTotal * 0.18;
  };

  if (loading) {
    return <div className="loading-container">Loading bill information...</div>;
  }

  if (!bill) {
    return <div className="error-container">No bill data available. Please go back and try again.</div>;
  }

  return (
    <div className="print-bill-container">
      <div id="printArea" className="print-only">
        <div className="bill-paper">
          {/* Bill Header */}
          <div className="bill-header">
            <h1>{restaurant ? restaurant.name : "Your Restaurant Name"}</h1>
            <p>{restaurant && restaurant.address ? 
                `${restaurant.address.street}, ${restaurant.address.city}, ${restaurant.address.state} - ${restaurant.address.zipCode}` : 
                "123 Street, City, State - 123456"}</p>
            <p>Phone: {restaurant && restaurant.phone ? restaurant.phone : "(123) 456-7890"}</p>
            <p>GST No: {restaurant && restaurant.gstNumber ? restaurant.gstNumber : "12ABCDE3456F7Z8"}</p>
          </div>
          
          <div className="bill-divider"></div>
          
          {/* Bill Details */}
          <div className="bill-details">
            <p><strong>Bill No:</strong> {billNumber}</p>
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
            <p>{restaurant && restaurant.receiptFooter ? restaurant.receiptFooter : "Thank you for dining with us!"}</p>
            <p>Please visit again</p>
          </div>
        </div>
      </div>
      
      {/* Back to app button - only visible on screen, hidden during print */}
      <div className="no-print back-button-container">
        <button 
          className="back-button"
          onClick={() => window.history.back()}
        >
          Back to App
        </button>
      </div>
    </div>
  );
}