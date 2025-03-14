import React from 'react'
import "../styles/viewbill.css"

export default function ViewBill() {
  return (
    <>
  <main className="viewbill-container">
    <h1>View Bills</h1>
    <div className="search-filter">
      <input type="text" id="search-input" placeholder="Search bills..." />
      <select id="filter-select">
        <option value="all">All</option>
        <option value="paid">Paid</option>
        <option value="unpaid">Unpaid</option>
      </select>
    </div>
    <table id="bills-table">
      <thead>
        <tr>
          <th>Bill ID</th>
          <th>Customer Name</th>
          <th>Table Number</th>
          <th>Total Amount</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {/* Example Bill Rows */}
        <tr>
          <td>001</td>
          <td>John Doe</td>
          <td>5</td>
          <td>$50.00</td>
          <td>
            <span className="status paid">Paid</span>
          </td>
          <td>
            <button className="action-btn view-btn" title="View Bill">
              <span className="material-symbols-outlined">visibility</span>
            </button>
            <button className="action-btn edit-btn" title="Edit Bill">
              <span className="material-symbols-outlined">edit</span>
            </button>
            <button className="action-btn delete-btn" title="Delete Bill">
              <span className="material-symbols-outlined">delete</span>
            </button>
          </td>
        </tr>
        <tr>
          <td>002</td>
          <td>Jane Smith</td>
          <td>3</td>
          <td>$75.00</td>
          <td>
            <span className="status unpaid">Unpaid</span>
          </td>
          <td>
            <button className="action-btn view-btn" title="View Bill">
              <span className="material-symbols-outlined">visibility</span>
            </button>
            <button className="action-btn edit-btn" title="Edit Bill">
              <span className="material-symbols-outlined">edit</span>
            </button>
            <button className="action-btn delete-btn" title="Delete Bill">
              <span className="material-symbols-outlined">delete</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </main>
</>

  )
}
