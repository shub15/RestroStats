import React from 'react'
import "../styles/view_menu.css"

export default function ViewMenu_1() {
    return (
        <>
            <main className="viewmenu-container">
                <h1>View Menu</h1>
                <div className="search-filter">
                    <input type="text" id="search-input" placeholder="Search menu items..." />
                    <select id="filter-select">
                        <option value="all">All</option>
                        <option value="food">Food</option>
                        <option value="beverage">Beverage</option>
                    </select>
                </div>
                <table id="menu-table">
                    <thead>
                        <tr>
                            <th>Item ID</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Example Menu Items */}
                        <tr>
                            <td>001</td>
                            <td>Burger</td>
                            <td>Food</td>
                            <td>$10.00</td>
                        </tr>
                        <tr>
                            <td>002</td>
                            <td>Pizza</td>
                            <td>Food</td>
                            <td>$15.00</td>
                        </tr>
                        <tr>
                            <td>003</td>
                            <td>Coffee</td>
                            <td>Beverage</td>
                            <td>$5.00</td>
                        </tr>
                        <tr>
                            <td>004</td>
                            <td>Pasta</td>
                            <td>Food</td>
                            <td>$12.00</td>
                        </tr>
                        <tr>
                            <td>005</td>
                            <td>Iced Tea</td>
                            <td>Beverage</td>
                            <td>$4.00</td>
                        </tr>
                    </tbody>
                </table>
            </main>
        </>

    )
}
