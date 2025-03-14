import React, { useState } from "react";
import logoDark from "../assets/LOGO 1 1024 dark.jpg";
import menuLogoDark from "../assets/LOGO 1 1024 menu-dark.jpg";
import "../styles/update_menu.css"

export default function UpdateMenu() {
  const [menuItems, setMenuItems] = useState([
    { id: "001", name: "Burger", category: "Food", price: 10.0 },
    { id: "002", name: "Pizza", category: "Food", price: 15.0 },
    { id: "003", name: "Coffee", category: "Beverage", price: 5.0 },
  ]);
  const [newItem, setNewItem] = useState({ name: "", category: "Food", price: "" });

  // Handle adding a new item
  const addItem = (e) => {
    e.preventDefault();
    if (!newItem.name || isNaN(newItem.price) || newItem.price <= 0) {
      alert("Invalid item details");
      return;
    }
    const newId = (menuItems.length + 1).toString().padStart(3, "0");
    setMenuItems([...menuItems, { id: newId, ...newItem }]);
    setNewItem({ name: "", category: "Food", price: "" });
  };

  // Handle saving edited item
  const updateItem = (index, field, value) => {
    const updatedItems = [...menuItems];
    updatedItems[index][field] = value;
    setMenuItems(updatedItems);
  };

  // Handle deleting an item
  const deleteItem = (id) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
  };

  return (
    <>

      {/* Main Content */}
      <main className="updatemenu-container">
        <h1>Update Menu</h1>

        {/* Add New Item Form */}
        <div className="add-item-form">
          <h2>Add New Item</h2>
          <form onSubmit={addItem}>
            <div className="form-group">
              <label htmlFor="new-item-name">Name</label>
              <input
                type="text"
                id="new-item-name"
                placeholder="Enter item name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="new-item-category">Category</label>
              <select
                id="new-item-category"
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                required
              >
                <option value="Food">Food</option>
                <option value="Beverage">Beverage</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="new-item-price">Price</label>
              <input
                type="number"
                id="new-item-price"
                placeholder="Enter price"
                step="0.01"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
                required
              />
            </div>
            <button type="submit" className="submit-btn">
              Add Item
            </button>
          </form>
        </div>

        {/* Menu Table */}
        <table id="menu-table">
          <thead>
            <tr>
              <th>Item ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item, index) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>
                  <input
                    type="text"
                    value={item.name}
                    className="editable-input"
                    onChange={(e) => updateItem(index, "name", e.target.value)}
                  />
                </td>
                <td>{item.category}</td>
                <td>
                  <input
                    type="number"
                    value={item.price}
                    className="editable-input"
                    step="0.01"
                    onChange={(e) => updateItem(index, "price", parseFloat(e.target.value))}
                  />
                </td>
                <td>
                  <button className="action-btn save-btn" title="Save Changes">
                    <span className="material-symbols-outlined">save</span>
                  </button>
                  <button
                    className="action-btn delete-btn"
                    title="Delete Item"
                    onClick={() => deleteItem(item.id)}
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
}
